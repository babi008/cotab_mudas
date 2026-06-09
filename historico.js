function formatarDataBR(dataISO){

    if(!dataISO){
        return "Não informado";
    }

    const partes = dataISO.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
const historico =
JSON.parse(
    localStorage.getItem(
        "historicoDashboard"
    )
) || [];

const tabela =
document.getElementById(
    "tabelaHistorico"
);

function carregarHistorico(){

    tabela.innerHTML = "";

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

    historico.forEach(
    (registro,index)=>{

        tabela.innerHTML += `

        <tr>

            <td>
                ${registro.dataAtualizacao}
            </td>

            <td>
                ${registro.totalMudas}
            </td>

            <td>
                ${registro.totalEspecies}
            </td>

        <td>

            <button
                onclick="verDetalhes(${index})">

                    Ver

            </button>

            <button
                onclick="gerarPDF(${index})"
                class="btn-pdf">

                    PDF

            </button>

        <button
        onclick="excluirLevantamento(${index})"
        class="btn-excluir">

                    Excluir

        </button>

    </td>

        </tr>

        `;

    });

}

function verDetalhes(index){

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

        </div>

        `;

    });

    detalhes.innerHTML = html;

}
function excluirLevantamento(index){

    const confirmar = confirm(
        "Deseja realmente excluir este levantamento?"
    );

    if(!confirmar){
        return;
    }

    historico.splice(index, 1);

    localStorage.setItem(
        "historicoDashboard",
        JSON.stringify(historico)
    );

    document.getElementById(
        "detalhes"
    ).innerHTML =
    "Selecione um levantamento.";

    carregarHistorico();

    alert(
        "Levantamento excluído com sucesso!"
    );

}
async function gerarPDF(index){

    const registro =
    historico[index];

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    let y = 20;

    doc.setFontSize(16);

    doc.text(
        "SECRETARIA MUNICIPAL DE MEIO AMBIENTE",
        10,
        y
    );

    y += 10;

    doc.text(
        "VIVEIRO MUNICIPAL",
        10,
        y
    );

    y += 15;

    doc.setFontSize(14);

    doc.text(
        "Relatório de Levantamento",
        10,
        y
    );

    y += 10;

    doc.setFontSize(11);

    doc.text(
        `Data: ${registro.dataAtualizacao}`,
        10,
        y
    );

    y += 15;

    registro.especies.forEach(item => {

        const especie =
        item.especie ||
        item.nome ||
        "Não informado";

        const quantidade =
        item.total ||
        item.quantidade ||
        0;

        const plantio = formatarDataBR(item.dataPlantio);

        const status =
        item.status || "-";

        doc.text(
            `Espécie: ${especie}`,
            10,
            y
        );

        y += 6;

        doc.text(
            `Quantidade: ${quantidade}`,
            10,
            y
        );

        y += 6;

        doc.text(
            `Plantio: ${plantio}`,
            10,
            y
        );

        y += 6;

        doc.text(
            `Status: ${status}`,
            10,
            y
        );

        y += 10;

        if(y > 260){

            doc.addPage();

            y = 20;
        }

    });

    y += 10;

    doc.setFontSize(12);

    doc.text(

        `Total Geral: ${registro.totalMudas} mudas`,

        10,

        y

    );

    doc.save(

        `levantamento-${registro.dataAtualizacao}.pdf`

    );

}

carregarHistorico();