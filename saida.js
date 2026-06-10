let saidas =
JSON.parse(localStorage.getItem("saidas")) || [];

const especies =
JSON.parse(localStorage.getItem("especies")) || [];

function carregarEspecies(){

    const select =
    document.getElementById("especieSelect");

    select.innerHTML = "";

    especies.forEach(especie => {

        select.innerHTML += `
            <option value="${especie.nome}">
                ${especie.nome}
            </option>
        `;

    });

}

function registrarSaida(){

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

    if(!especie){
        alert("Selecione uma espécie.");
        return;
    }

    if(quantidade <= 0){
        alert("Informe uma quantidade válida.");
        return;
    }

    const hoje = new Date();

saidas.push({
    especie,
    quantidade,
    motivo,
    destino,
    observacao,

    data:
    hoje.toLocaleDateString(
        "pt-BR"
    ),

    dataISO:
    hoje.toISOString()

});

    localStorage.setItem(
        "saidas",
        JSON.stringify(saidas)
    );

    alert("Saída registrada com sucesso!");

    document.getElementById("quantidadeSaida").value = "";
    document.getElementById("destinoSaida").value = "";
    document.getElementById("observacaoSaida").value = "";

    carregarSaidas();
}

function carregarSaidas(){

    const lista =
    document.getElementById("listaSaidas");

    lista.innerHTML = "";

    if(saidas.length === 0){

        lista.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma saída registrada.
                </td>
            </tr>
        `;

        return;
    }

    saidas.forEach((saida,index) => {

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
                        onclick="excluirSaida(${index})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;

    });

}

function excluirSaida(index){

    const confirmar =
    confirm("Deseja excluir esta saída?");

    if(!confirmar) return;

    saidas.splice(index,1);

    localStorage.setItem(
        "saidas",
        JSON.stringify(saidas)
    );

    const hoje = new Date();

saida.push({

    especie,

    quantidade,

    motivo,

    destino,

    observacao,

    data:
    hoje.toLocaleDateString(
        "pt-BR"
    ),

    dataISO:
    hoje.toISOString()

});
localStorage.setItem(
    "saida",
    JSON.stringify(saida)
);

    carregarSaidas();
}

carregarEspecies();
carregarSaidas();