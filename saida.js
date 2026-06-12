import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const colecaoEspecies =
collection(db, "especies");

const colecaoSaidas =
collection(db, "saidas");

/*
=========================
CARREGAR ESPÉCIES
=========================
*/

async function carregarEspecies(){

    const select =
    document.getElementById("especieSelect");

    select.innerHTML = "";

    const snapshot =
    await getDocs(colecaoEspecies);

    if(snapshot.empty){

        select.innerHTML = `
            <option>
                Nenhuma espécie cadastrada
            </option>
        `;

        return;
    }

    snapshot.forEach(documento => {

        const especie =
        documento.data();

        select.innerHTML += `
            <option value="${especie.nome}">
                ${especie.nome}
            </option>
        `;
    });
}

/*
=========================
REGISTRAR SAÍDA NO FIREBASE
=========================
*/

window.registrarSaida = async function(){

    const especie =
    document.getElementById("especieSelect").value;

    const quantidade =
    Number(document.getElementById("quantidadeSaida").value);

    const motivo =
    document.getElementById("motivoSaida").value;

    const destino =
    document.getElementById("destinoSaida").value.trim();

    const observacao =
    document.getElementById("observacaoSaida").value.trim();

    if(!especie || especie === "Nenhuma espécie cadastrada"){

        alert("Selecione uma espécie válida.");
        return;
    }

    if(quantidade <= 0){

        alert("Informe uma quantidade válida.");
        return;
    }

    const hoje =
    new Date();

    await addDoc(colecaoSaidas, {

        especie,

        quantidade,

        motivo,

        destino,

        observacao,

        data:
        hoje.toLocaleDateString("pt-BR"),

        dataISO:
        hoje.toISOString(),

        criadoEm:
        hoje.toISOString()

    });

    alert("Saída registrada com sucesso!");

    document.getElementById("quantidadeSaida").value = "";
    document.getElementById("destinoSaida").value = "";
    document.getElementById("observacaoSaida").value = "";

    carregarSaidas();
};

/*
=========================
CARREGAR SAÍDAS
=========================
*/

async function carregarSaidas(){

    const lista =
    document.getElementById("listaSaidas");

    lista.innerHTML = "";

    const snapshot =
    await getDocs(colecaoSaidas);

    if(snapshot.empty){

        lista.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma saída registrada.
                </td>
            </tr>
        `;

        return;
    }

    snapshot.forEach(documento => {

        const saida =
        documento.data();

        lista.innerHTML += `
            <tr>
                <td>${saida.data}</td>
                <td>${saida.especie}</td>
                <td>${saida.quantidade}</td>
                <td>${saida.motivo}</td>
                <td>${saida.destino || "-"}</td>
                <td>
                    <button
                        class="btn-excluir"
                        onclick="excluirSaida('${documento.id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

/*
=========================
EXCLUIR SAÍDA
=========================
*/

window.excluirSaida = async function(id){

    const confirmar =
    confirm("Deseja excluir esta saída?");

    if(!confirmar) return;

    await deleteDoc(
        doc(db, "saidas", id)
    );

    carregarSaidas();
};

/*
=========================
INICIAR
=========================
*/

carregarEspecies();
carregarSaidas();