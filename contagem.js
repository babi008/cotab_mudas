import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

let fileiras = [];

const colecaoEspecies =
collection(db, "especies");

const colecaoContagens =
collection(db, "contagens");

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
ADICIONAR FILEIRA
=========================
*/

window.adicionarFileira = function(){

    const quantidade =
    Number(
        document.getElementById("quantidade").value
    );

    if(!quantidade || quantidade <= 0){

        alert("Informe uma quantidade válida.");
        return;
    }

    fileiras.push(quantidade);

    atualizarLista();

    document.getElementById("quantidade").value = "";
};

/*
=========================
ATUALIZAR LISTA
=========================
*/

function atualizarLista(){

    const lista =
    document.getElementById("listaFileiras");

    lista.innerHTML = "";

    let total = 0;

    fileiras.forEach((valor,index)=>{

        total += valor;

        lista.innerHTML += `
            <li>
                <span>
                    ✓ Fileira ${index + 1}
                    - ${valor} mudas
                </span>

                <button
                    class="btn-remover"
                    onclick="removerFileira(${index})">
                    🗑️
                </button>
            </li>
        `;
    });

    document.getElementById("total").innerHTML =
    `Total: ${total} mudas`;
}

/*
=========================
REMOVER FILEIRA
=========================
*/

window.removerFileira = function(index){

    const confirmar =
    confirm("Deseja remover esta fileira?");

    if(!confirmar) return;

    fileiras.splice(index,1);

    atualizarLista();
};

/*
=========================
SALVAR CONTAGEM NO FIREBASE
=========================
*/

window.salvarContagem = async function(){

    if(fileiras.length === 0){

        alert("Adicione pelo menos uma fileira.");
        return;
    }

    const especie =
    document.getElementById("especieSelect").value;

    if(!especie || especie === "Nenhuma espécie cadastrada"){

        alert("Cadastre uma espécie antes de salvar a contagem.");
        return;
    }

    const dataPlantio =
    document.getElementById("dataPlantio").value;

    const status =
    document.getElementById("status").value;

    const observacao =
    document.getElementById("observacao").value.trim();

    const total =
    fileiras.reduce((a,b)=>a+b,0);

    const hoje =
    new Date();

    await addDoc(colecaoContagens, {

        especie,

        dataPlantio,

        status,

        observacao,

        fileiras:[...fileiras],

        total,

        data:
        hoje.toLocaleDateString("pt-BR"),

        dataISO:
        hoje.toISOString(),

        criadoEm:
        hoje.toISOString()

    });

    mostrarMensagemSucesso(
        especie,
        total
    );

    fileiras = [];

    atualizarLista();

    document.getElementById("observacao").value = "";
    document.getElementById("dataPlantio").value = "";
};

/*
=========================
MENSAGEM DE SUCESSO
=========================
*/

function mostrarMensagemSucesso(especie,total){

    const caixa =
    document.getElementById("mensagemSucesso");

    const dataAtual =
    new Date().toLocaleDateString("pt-BR");

    caixa.innerHTML = `
        <h3>✅ Contagem salva com sucesso!</h3>

        <br>

        <p>
            <strong>Espécie:</strong>
            ${especie}
        </p>

        <p>
            <strong>Total:</strong>
            ${total} mudas
        </p>

        <p>
            <strong>Data:</strong>
            ${dataAtual}
        </p>
    `;

    caixa.style.display = "block";

    setTimeout(()=>{
        caixa.style.display = "none";
    },5000);
}

/*
=========================
INICIAR
=========================
*/

carregarEspecies();