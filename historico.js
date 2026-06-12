import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

function formatarDataBR(dataISO){

    if(!dataISO){
        return "Não informado";
    }

    const partes =
    dataISO.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

const tabela =
document.getElementById(
    "tabelaHistorico"
);

let historico = [];

/*
=========================
CARREGAR HISTÓRICO
=========================
*/

async function carregarHistorico(){

    tabela.innerHTML = "";

    const snapshot =
    await getDocs(
        collection(db, "historicoDashboard")
    );

    historico = [];

    snapshot.forEach(documento => {

        historico.push({
            id: documento.id,
            ...documento.data()
        });

    });

    if(historico.length === 0){

        tabela.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum levantamento registrado.
                </td>
            </tr>
        `;

        return;
    }

    historico.forEach((registro,index)=>{

        tabela.innerHTML += `
            <tr>
                <td>${registro.dataAtualizacao}</td>

                <td>${registro.totalMudas}</td>

                <td>${registro.totalEspecies}</td>

                <td>
                    <button onclick="verDetalhes(${index})">
                        Ver
                    </button>

                    <button
                        onclick="excluirLevantamento('${registro.id}')"
                        class="btn-excluir">
                        Excluir
                    </button>
                </td>
            </tr>
        `;

    });

}

/*
=========================
VER DETALHES
=========================
*/

window.verDetalhes = function(index){

    const registro =
    historico[index];

    const detalhes =
    document.getElementById(
        "detalhes"
    );

    let html = "";

    if(
        !registro.especies ||
        registro.especies.length === 0
    ){

        detalhes.innerHTML = `
            <p>
                Nenhum detalhe encontrado.
            </p>
        `;

        return;
    }

    registro.especies.forEach(item => {

        const nome =
        item.especie ||
        item.nome ||
        "Espécie não informada";

        const quantidade =
        item.total ||
        item.quantidade ||
        0;

        const plantio =
        formatarDataBR(
            item.dataPlantio
        );

        const status =
        item.status ||
        "-";

        const observacao =
        item.observacao ||
        "-";

        html += `
            <div
            style="
                margin-bottom:15px;
                padding:15px;
                border-left:4px solid #2e7d32;
                background:#f8f8f8;
                border-radius:5px;
            ">

                <strong>
                    🌱 ${nome}
                </strong>

                <br><br>

                <strong>Quantidade:</strong>
                ${quantidade}

                <br>

                <strong>Plantio:</strong>
                ${plantio}

                <br>

                <strong>Status:</strong>
                ${status}

                <br>

                <strong>Observação:</strong>
                ${observacao}

            </div>
        `;

    });

    detalhes.innerHTML = html;

};

/*
=========================
EXCLUIR LEVANTAMENTO
=========================
*/

window.excluirLevantamento = async function(id){

    const confirmar =
    confirm(
        "Deseja realmente excluir este levantamento?"
    );

    if(!confirmar){
        return;
    }

    await deleteDoc(
        doc(db, "historicoDashboard", id)
    );

    document.getElementById(
        "detalhes"
    ).innerHTML =
    "Selecione um levantamento.";

    await carregarHistorico();

    alert(
        "Levantamento excluído com sucesso!"
    );

};

/*
=========================
INICIAR
=========================
*/

carregarHistorico();