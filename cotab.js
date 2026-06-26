import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const hoje = new Date();

document.getElementById("dataAtual").innerHTML =
    hoje.toLocaleDateString("pt-BR");

document.getElementById("ultimaAtualizacao").innerHTML =
    hoje.toLocaleDateString("pt-BR");

/*
=========================
CARREGAR DASHBOARD
=========================
*/

async function carregarDashboard(){

    const especiesSnapshot =
    await getDocs(
        collection(db, "especies")
    );

    document.getElementById("totalEspecies").innerHTML =
    especiesSnapshot.size;

    const relatoriosSnapshot =
    await getDocs(
        collection(db, "relatoriosGerados")
    );

    document.getElementById("relatorio").innerHTML =
    relatoriosSnapshot.size;

    const contagensSnapshot =
    await getDocs(
        collection(db, "contagens")
    );

    let totalContado = 0;
    let ultimaData = "";

    contagensSnapshot.forEach(documento => {

        const contagem =
        documento.data();

        totalContado +=
        Number(contagem.total || 0);

        ultimaData =
        contagem.data || ultimaData;

    });

    const saidasSnapshot =
    await getDocs(
        collection(db, "saidas")
    );

    let totalSaidas = 0;

    saidasSnapshot.forEach(documento => {

        const saida =
        documento.data();

        totalSaidas +=
        Number(saida.quantidade || 0);

    });

    const totalAtual =
    totalContado - totalSaidas;

    document.getElementById("totalMudas").innerHTML =
    totalAtual;

    if(ultimaData){

        document.getElementById("ultimaAtualizacao").innerHTML =
        ultimaData;

    }else{

        document.getElementById("ultimaAtualizacao").innerHTML =
        hoje.toLocaleDateString("pt-BR");

    }
}

/*
=========================
REGISTRAR LEVANTAMENTO
NO FIREBASE
=========================
*/

window.registrarLevantamento = async function(){

    const contagensSnapshot =
    await getDocs(
        collection(db, "contagens")
    );

    let contagens = [];

    contagensSnapshot.forEach(documento => {

        const contagem =
        documento.data();

        contagens.push({
            id: documento.id,
            ...contagem
        });

    });

    if(contagens.length === 0){

        alert(
            "Não existem contagens registradas."
        );

        return;
    }

    /*
    =========================
    AGRUPAR ESPÉCIES LANÇADAS
    =========================
    */

    const especiesAgrupadas = [];

    contagens.forEach(contagem => {

        const nomeEspecie =
        contagem.especie || contagem.nome;

        let especieExistente =
        especiesAgrupadas.find(item =>
            (item.especie || item.nome) === nomeEspecie
        );

        if(especieExistente){

            especieExistente.total =
            Number(especieExistente.total || 0) +
            Number(contagem.total || 0);

            especieExistente.quantidade =
            especieExistente.total;

            if(contagem.fileiras){
                especieExistente.fileiras = [
                    ...(especieExistente.fileiras || []),
                    ...contagem.fileiras
                ];
            }

        }else{

            especiesAgrupadas.push({
                ...contagem,
                especie: nomeEspecie,
                total: Number(contagem.total || 0),
                quantidade: Number(contagem.total || 0),
                fileiras: contagem.fileiras || []
            });

        }

    });

    const totalEspecies =
    especiesAgrupadas.length;

    const totalMudasAgrupado =
    especiesAgrupadas.reduce((soma,item)=>{
        return soma + Number(item.total || 0);
    },0);

    const hoje =
    new Date();

    const mesAtual =
    hoje.getMonth();

    const anoAtual =
    hoje.getFullYear();

    const historicoSnapshot =
    await getDocs(
        collection(db, "historicoDashboard")
    );

    let levantamentoExistente = null;

    historicoSnapshot.forEach(documento => {

        const item =
        documento.data();

        if(item.dataRegistroISO){

            const data =
            new Date(item.dataRegistroISO);

            if(
                data.getMonth() === mesAtual &&
                data.getFullYear() === anoAtual
            ){
                levantamentoExistente = {
                    id: documento.id,
                    ...item
                };
            }

        }

    });

    const levantamento = {

        dataAtualizacao:
        hoje.toLocaleDateString(
            "pt-BR"
        ),

        dataRegistroISO:
        hoje.toISOString(),

        editadoEm:
        hoje.toISOString(),

        totalMudas:
        totalMudasAgrupado,

        totalEspecies,

        especies:
        [...especiesAgrupadas]

    };

    if(levantamentoExistente){

        await updateDoc(
            doc(
                db,
                "historicoDashboard",
                levantamentoExistente.id
            ),
            levantamento
        );

        alert(
            "Levantamento deste mês atualizado com sucesso!"
        );

    }else{

        await addDoc(
            collection(db, "historicoDashboard"),
            levantamento
        );

        alert(
            "Novo levantamento registrado!"
        );

    }

    mostrarSucessoLevantamento(
        totalMudasAgrupado,
        totalEspecies
    );

    carregarDashboard();

};

/*
=========================
MENSAGEM
=========================
*/

function mostrarSucessoLevantamento(
    totalMudas,
    totalEspecies
){

    const div =
    document.getElementById(
        "mensagemDashboard"
    );

    div.innerHTML = `
        <h3>
            ✅ Levantamento Registrado
        </h3>

        <p>
            Total de mudas:
            <strong>${totalMudas}</strong>
        </p>

        <p>
            Total de espécies lançadas:
            <strong>${totalEspecies}</strong>
        </p>

        <p>
            Data:
            <strong>
                ${
                    new Date()
                    .toLocaleDateString(
                        "pt-BR"
                    )
                }
            </strong>
        </p>
    `;

    div.style.display =
    "block";

}

/*
=========================
RESET LOCAL
=========================
*/

window.resetarSistema = function(){

    const confirmar = confirm(
        "Isso apaga apenas dados locais do navegador. Os dados do Firebase continuam salvos. Deseja continuar?"
    );

    if(!confirmar){
        return;
    }

    localStorage.clear();

    alert(
        "Dados locais apagados com sucesso!"
    );

    location.reload();

};

/*
=========================
INICIAR
=========================
*/

carregarDashboard();