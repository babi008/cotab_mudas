import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

function formatarDataBR(dataISO){
    if(!dataISO) return "-";

    const partes = dataISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

const select =
document.getElementById("selectLevantamento");

let historico = [];

/*
=========================
CARREGAR LEVANTAMENTOS
=========================
*/

async function carregarLevantamentos(){

    select.innerHTML = "";

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
        select.innerHTML = `
            <option>
                Nenhum levantamento registrado
            </option>
        `;
        return;
    }

    historico.forEach((item,index)=>{

        const option =
        document.createElement("option");

        option.value = index;

        option.textContent =
        `${item.dataAtualizacao} - ${item.totalMudas} mudas`;

        select.appendChild(option);
    });
}

/*
=========================
GERAR PDF
=========================
*/

window.gerarPDF = async function(){

    const indice = select.value;

    const registro = historico[indice];

    if(!registro){
        alert("Selecione um levantamento válido.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(
        "SECRETARIA MUNICIPAL DE MEIO AMBIENTE (SEMMA)",
        14,
        20
    );

    doc.setFontSize(12);
    doc.text("VIVEIRO MUNICIPAL", 14, 28);

    doc.text(
        `Levantamento: ${registro.dataAtualizacao}`,
        14,
        40
    );

    const dadosTabela =
    registro.especies.map(item => [
        item.especie || item.nome || "-",
        item.total || item.quantidade || 0,
        formatarDataBR(item.dataPlantio),
        item.status || "-",
        item.observacao || "-"
    ]);

    doc.autoTable({
        startY: 50,

        head: [[
            "Espécie",
            "Quantidade",
            "Plantio",
            "Status",
            "Observação"
        ]],

        body: dadosTabela
    });

    /*
    =========================
    SAÍDAS DO FIREBASE
    =========================
    */

    const saidasSnapshot =
    await getDocs(
        collection(db, "saidas")
    );

    const saidas = [];

    saidasSnapshot.forEach(documento => {
        saidas.push({
            id: documento.id,
            ...documento.data()
        });
    });

    const mesAnoRelatorio =
    registro.dataRegistroISO.slice(0, 7);

    const saidasDoMes =
    saidas.filter(item => {

        if(!item.dataISO){
            return false;
        }

        return item.dataISO.slice(0,7)
        === mesAnoRelatorio;

    });

    const dadosSaida =
    saidasDoMes.map(item => [
        item.data || "-",
        item.especie || "-",
        item.quantidade || 0,
        item.motivo || "-",
        item.destino || "-",
        item.observacao || "-"
    ]);

    let yFinal =
    doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);

    doc.text(
        "Saída de Mudas no Mês",
        14,
        yFinal
    );

    doc.autoTable({
        startY: yFinal + 8,

        head: [[
            "Data",
            "Espécie",
            "Quantidade",
            "Motivo",
            "Destino",
            "Observação"
        ]],

        body:
        dadosSaida.length > 0
        ? dadosSaida
        : [[
            "-",
            "Nenhuma saída registrada",
            "-",
            "-",
            "-",
            "-"
        ]]
    });

    const totalSaida =
    saidasDoMes.reduce(
        (soma,item)=>
        soma + Number(item.quantidade),
        0
    );

    const totalAposRetirada =
    registro.totalMudas - totalSaida;

    const yResumo =
    doc.lastAutoTable.finalY + 15;

    doc.text(
        `Total Geral de Mudas: ${registro.totalMudas}`,
        14,
        yResumo
    );

    doc.text(
        `Total de Saídas no Mês: ${totalSaida}`,
        14,
        yResumo + 8
    );

    doc.text(
        `Total Após Retiradas: ${totalAposRetirada}`,
        14,
        yResumo + 16
    );

    /*
    =========================
    REGISTRA RELATÓRIO GERADO
    =========================
    */

    const agora =
    new Date();

    await addDoc(
        collection(db, "relatoriosGerados"),
        {
            levantamento:
            registro.dataAtualizacao,

            totalMudas:
            registro.totalMudas,

            totalSaidas:
            totalSaida,

            totalAposRetirada:
            totalAposRetirada,

            dataGeracao:
            agora.toLocaleDateString("pt-BR"),

            dataISO:
            agora.toISOString()
        }
    );

    doc.save(
        `Relatorio_${registro.dataAtualizacao}.pdf`
    );

};

/*
=========================
INICIAR
=========================
*/

carregarLevantamentos();