function formatarDataBR(dataISO){

    if(!dataISO){
        return "-";
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

const select =
document.getElementById(
    "selectLevantamento"
);

function carregarLevantamentos(){

    historico.forEach(
    (item,index)=>{

        const option =
        document.createElement(
            "option"
        );

        option.value = index;

        option.textContent =
        `${item.dataAtualizacao} - ${item.totalMudas} mudas`;

        select.appendChild(
            option
        );

    });

}

function gerarPDF(){

    const indice =
    select.value;

    const registro =
    historico[indice];

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    doc.setFontSize(16);

    doc.text(
        "SECRETARIA MUNICIPAL DE MEIO AMBIENTE(SEMMA)",
        14,
        20
    );

    doc.setFontSize(12);

    doc.text(
        "VIVEIRO MUNICIPAL",
        14,
        28
    );

    doc.text(
        `Levantamento: ${registro.dataAtualizacao}`,
        14,
        40
    );

    const dadosTabela = [];

    registro.especies.forEach(item => {

        dadosTabela.push([

            item.especie,

            item.total,

            formatarDataBR(item.dataPlantio),

            item.status || "-",

            item.observacao || "-"

        ]);

    });

    doc.autoTable({

        startY:50,

        head:[[
            "Espécie",
            "Quantidade",
            "Plantio",
            "Status",
            "Observação"
        ]],

        body:dadosTabela

    });

    doc.text(

        `Total Geral: ${registro.totalMudas} mudas`,

        14,

        doc.lastAutoTable.finalY + 15

    );

    doc.save(

        `Relatorio_${registro.dataAtualizacao}.pdf`

    );

}

carregarLevantamentos();