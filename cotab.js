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

    // ESPÉCIES
    const especiesSnapshot =
    await getDocs(
        collection(db, "especies")
    );

    document.getElementById("totalEspecies").innerHTML =
    especiesSnapshot.size;

    // CONTAGENS
    const contagensSnapshot =
    await getDocs(
        collection(db, "contagens")
    );

    let contagens = [];

    let totalContado = 0;

    let ultimaData = "";

    contagensSnapshot.forEach(documento => {

        const contagem =
        documento.data();

        contagens.push({
            id: documento.id,
            ...contagem
        });

        totalContado +=
        Number(contagem.total);

        ultimaData =
        contagem.data || ultimaData;

    });

    // SAÍDAS
    const saidasSnapshot =
    await getDocs(
        collection(db, "saidas")
    );

    let totalSaidas = 0;

    saidasSnapshot.forEach(documento => {

        const saida =
        documento.data();

        totalSaidas +=
        Number(saida.quantidade);

    });

    const totalAtual =
    totalContado - totalSaidas;

    document.getElementById("totalMudas").innerHTML =
    totalAtual;

    if(ultimaData){

        document.getElementById("ultimaAtualizacao").innerHTML =
        ultimaData;

    }

    // RELATÓRIOS GERADOS
    const relatoriosSnapshot =
    await getDocs(
        collection(db, "relatoriosGerados")
    );

    document.getElementById("relatorio").innerHTML =
    relatoriosSnapshot.size;
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

    let totalMudas = 0;

    contagensSnapshot.forEach(documento => {

        const contagem =
        documento.data();

        contagens.push({
            id: documento.id,
            ...contagem
        });

        totalMudas +=
        Number(contagem.total);

    });

    if(contagens.length === 0){

        alert(
            "Não existem contagens registradas."
        );

        return;
    }

    const especiesSnapshot =
    await getDocs(
        collection(db, "especies")
    );

    const totalEspecies =
    especiesSnapshot.size;

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

        totalMudas,

        totalEspecies,

        especies:
        [...contagens]

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
        totalMudas,
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
            Total de espécies:
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