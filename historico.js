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


carregarHistorico();