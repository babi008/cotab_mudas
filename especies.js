import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const colecaoEspecies = collection(db, "especies");

/*
=========================
CADASTRAR
=========================
*/

window.cadastrarEspecie = async function(){

    const campo =
    document.getElementById("nomeEspecie");

    const nome =
    campo.value.trim();

    if(nome === ""){
        alert("Digite o nome da espécie.");
        return;
    }

    const especies =
    await buscarEspecies();

    const existe =
    especies.some(
        especie =>
        especie.nome.toLowerCase()
        === nome.toLowerCase()
    );

    if(existe){
        alert("Essa espécie já existe.");
        return;
    }

    await addDoc(colecaoEspecies, {
        nome: nome,
        criadoEm: new Date().toISOString()
    });

    campo.value = "";

    carregarEspecies();
};

/*
=========================
BUSCAR ESPÉCIES
=========================
*/

async function buscarEspecies(){

    const snapshot =
    await getDocs(colecaoEspecies);

    const especies = [];

    snapshot.forEach(documento => {
        especies.push({
            id: documento.id,
            ...documento.data()
        });
    });

    return especies;
}

/*
=========================
EDITAR
=========================
*/

window.editarEspecie = async function(id, nomeAtual){

    const novoNome =
    prompt("Editar espécie:", nomeAtual);

    if(!novoNome) return;

    const nome =
    novoNome.trim();

    if(nome === ""){
        alert("Nome inválido.");
        return;
    }

    const especies =
    await buscarEspecies();

    const duplicada =
    especies.some(
        especie =>
        especie.id !== id &&
        especie.nome.toLowerCase()
        === nome.toLowerCase()
    );

    if(duplicada){
        alert("Já existe uma espécie com esse nome.");
        return;
    }

    await updateDoc(
        doc(db, "especies", id),
        {
            nome: nome,
            atualizadoEm: new Date().toISOString()
        }
    );

    carregarEspecies();
};

/*
=========================
EXCLUIR
=========================
*/

window.excluirEspecie = async function(id){

    const confirmar =
    confirm("Deseja excluir esta espécie?");

    if(!confirmar) return;

    await deleteDoc(
        doc(db, "especies", id)
    );

    carregarEspecies();
};

/*
=========================
LISTAR
=========================
*/

async function carregarEspecies(){

    const lista =
    document.getElementById("listaEspecies");

    lista.innerHTML = "";

    const especies =
    await buscarEspecies();

    if(especies.length === 0){
        lista.innerHTML = `
            <tr>
                <td colspan="3">
                    Nenhuma espécie cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    especies.forEach((especie,index)=>{

        lista.innerHTML += `
            <tr>
                <td>${index + 1}</td>

                <td>🌱 ${especie.nome}</td>

                <td>
                    <button
                        class="btn-editar"
                        onclick="editarEspecie('${especie.id}', '${especie.nome}')">
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEspecie('${especie.id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

/*
=========================
INICIAR
=========================
*/

carregarEspecies();