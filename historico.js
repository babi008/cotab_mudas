import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

function formatarDataBR(dataISO){

    if(!dataISO){
        return "Não informado";
    }

    if(dataISO.includes("/")){
        return dataISO;
    }

    const partes = dataISO.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

const tabela = document.getElementById("tabelaHistorico");
const detalhes = document.getElementById("detalhes");

let historico = [];

/*
=========================
CARREGAR HISTÓRICO
=========================
*/

async function carregarHistorico(){

    tabela.innerHTML = "";

    const snapshot = await getDocs(
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

    const registro = historico[index];

    let html = "";

    if(
        !registro.especies ||
        registro.especies.length === 0
    ){

        detalhes.innerHTML = `
            <p>
                Nenhuma espécie encontrada neste levantamento.
            </p>
        `;

        return;
    }

    registro.especies.forEach((item, i) => {

        const nome =
        item.especie ||
        item.nome ||
        "Espécie não informada";

        const quantidade =
        item.total ||
        item.quantidade ||
        0;

        const plantio =
        formatarDataBR(item.dataPlantio);

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

                <br><br>

                <button onclick="editarEspecie(${index}, ${i})">
                    Editar
                </button>

                <button
                    onclick="excluirEspecie(${index}, ${i})"
                    class="btn-excluir">
                    Excluir espécie
                </button>

            </div>
        `;

    });

    detalhes.innerHTML = html;

};

/*
=========================
EDITAR ESPÉCIE INDIVIDUAL
=========================
*/

window.editarEspecie = function(indexLevantamento, indexEspecie){

    const registro = historico[indexLevantamento];
    const item = registro.especies[indexEspecie];

    const nome =
    item.especie ||
    item.nome ||
    "Espécie não informada";

    const quantidade =
    item.total ||
    item.quantidade ||
    0;

    const plantio =
    item.dataPlantio ||
    "";

    const status =
    item.status ||
    "";

    const observacao =
    item.observacao ||
    "";

    detalhes.innerHTML = `
        <div
        style="
            margin-bottom:15px;
            padding:15px;
            border-left:4px solid #1565c0;
            background:#f8f8f8;
            border-radius:5px;
        ">

            <h3>Editando espécie</h3>

            <strong>🌱 ${nome}</strong>

            <br><br>

            <label>Quantidade</label>
            <input
                type="number"
                id="editQuantidade"
                value="${quantidade}"
                style="width:100%; margin-bottom:10px;"
            >

            <label>Data de Plantio</label>
            <input
                type="date"
                id="editPlantio"
                value="${plantio}"
                style="width:100%; margin-bottom:10px;"
            >

            <label>Status</label>
            <select
                id="editStatus"
                style="width:100%; margin-bottom:10px;"
            >
                <option ${status === "Saudável" ? "selected" : ""}>Saudável</option>
                <option ${status === "Necessita irrigação" ? "selected" : ""}>Necessita irrigação</option>
                <option ${status === "Em desenvolvimento" ? "selected" : ""}>Em desenvolvimento</option>
                <option ${status === "Pronta para doação" ? "selected" : ""}>Pronta para doação</option>
                <option ${status === "Pronta para o plantio definitivo" ? "selected" : ""}>Pronta para o plantio definitivo</option>
            </select>

            <label>Observação</label>
            <textarea
                id="editObservacao"
                rows="3"
                style="width:100%; margin-bottom:10px;"
            >${observacao}</textarea>

            <button onclick="salvarEdicaoEspecie(${indexLevantamento}, ${indexEspecie})">
                Salvar alterações
            </button>

            <button onclick="verDetalhes(${indexLevantamento})">
                Cancelar
            </button>

        </div>
    `;
};

/*
=========================
SALVAR EDIÇÃO DA ESPÉCIE
=========================
*/

window.salvarEdicaoEspecie = async function(indexLevantamento, indexEspecie){

    const registro = historico[indexLevantamento];

    const novaQuantidade =
    Number(document.getElementById("editQuantidade").value);

    if(!novaQuantidade || novaQuantidade <= 0){

        alert("Informe uma quantidade válida.");
        return;
    }

    const novoPlantio =
    document.getElementById("editPlantio").value;

    const novoStatus =
    document.getElementById("editStatus").value;

    const novaObservacao =
    document.getElementById("editObservacao").value.trim();

    registro.especies[indexEspecie] = {
        ...registro.especies[indexEspecie],
        total: novaQuantidade,
        quantidade: novaQuantidade,
        dataPlantio: novoPlantio,
        status: novoStatus,
        observacao: novaObservacao
    };

    const totalMudas = registro.especies.reduce((soma, item) => {
        return soma + Number(item.total || item.quantidade || 0);
    }, 0);

    const totalEspecies = registro.especies.length;

    await updateDoc(
        doc(db, "historicoDashboard", registro.id),
        {
            especies: registro.especies,
            totalMudas,
            totalEspecies,
            editadoEm: new Date().toISOString(),
            usarNoDashboard: true
        }
    );

    alert("Espécie atualizada com sucesso!");

    await carregarHistorico();

    verDetalhes(indexLevantamento);
};

/*
=========================
EXCLUIR ESPÉCIE INDIVIDUAL
=========================
*/

window.excluirEspecie = async function(indexLevantamento, indexEspecie){

    const confirmar = confirm(
        "Deseja realmente excluir esta espécie deste levantamento?"
    );

    if(!confirmar){
        return;
    }

    const registro = historico[indexLevantamento];

    registro.especies.splice(indexEspecie, 1);

    const totalMudas = registro.especies.reduce((soma, item) => {
        return soma + Number(item.total || item.quantidade || 0);
    }, 0);

    const totalEspecies = registro.especies.length;

    await updateDoc(
        doc(db, "historicoDashboard", registro.id),
        {
            especies: registro.especies,
            totalMudas,
            totalEspecies,
            editadoEm: new Date().toISOString(),
            usarNoDashboard: true
        }
    );

    alert("Espécie excluída com sucesso!");

    await carregarHistorico();

    if(totalEspecies === 0){
        detalhes.innerHTML = `
            <p>
                Nenhuma espécie encontrada neste levantamento.
            </p>
        `;
    } else {
        verDetalhes(indexLevantamento);
    }
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

    detalhes.innerHTML =
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