const hoje = new Date();

document.getElementById("dataAtual").innerHTML =
    hoje.toLocaleDateString("pt-BR");

document.getElementById("ultimaAtualizacao").innerHTML =
    hoje.toLocaleDateString("pt-BR");

/*
Dados temporários.
Depois serão substituídos pelo Firebase.
*/

const especies =
JSON.parse(
    localStorage.getItem("especies")
) || [];

document.getElementById(
    "totalEspecies"
).innerHTML =
especies.length;

const contagens =
JSON.parse(localStorage.getItem("contagens")) || [];

const saidas =
JSON.parse(localStorage.getItem("saidas")) || [];

let totalContado = 0;

contagens.forEach(contagem => {
    totalContado += Number(contagem.total);
});

let totalSaidas = 0;

saidas.forEach(saida => {
    totalSaidas += Number(saida.quantidade);
});

const totalAtual =
totalContado - totalSaidas;

document.getElementById("totalMudas").innerHTML =
totalAtual;
const relatorioGerados =
Number(localStorage.getItem("relatorioGerados")) || 0;

document.getElementById("relatorio").innerHTML =
relatorioGerados; 

if(contagens.length > 0){

    const ultimaContagem =
    contagens[
        contagens.length - 1
    ];

    document.getElementById(
        "ultimaAtualizacao"
    ).innerHTML =
    ultimaContagem.data;

}
function registrarLevantamento(){

    const contagens =
    JSON.parse(
        localStorage.getItem("contagens")
    ) || [];

    const especies =
    JSON.parse(
        localStorage.getItem("especies")
    ) || [];

    if(contagens.length === 0){

        alert(
            "Não existem contagens registradas."
        );

        return;
    }

    const historico =
    JSON.parse(
        localStorage.getItem(
            "historicoDashboard"
        )
    ) || [];

    const hoje = new Date();

    const mesAtual =
    hoje.getMonth();

    const anoAtual =
    hoje.getFullYear();

   const indiceExistente =
historico.findIndex(item => {

    const data =
    new Date(item.dataRegistroISO);

    return (
        data.getMonth() === mesAtual &&
        data.getFullYear() === anoAtual
    );

});

    let totalMudas = 0;

    contagens.forEach(contagem => {

        totalMudas += contagem.total;

    });

    const levantamento = {

    dataAtualizacao:
    hoje.toLocaleDateString(
        "pt-BR"
    ),

    dataRegistroISO:
    hoje.toISOString(),

    totalMudas,

    totalEspecies:
    especies.length,

    especies:
    [...contagens]

};
    if(indiceExistente !== -1){

    historico[indiceExistente] =
    levantamento;

    alert(
        "Levantamento deste mês atualizado com sucesso!"
    );

}else{

    historico.push(
        levantamento
    );

    alert(
        "Novo levantamento registrado!"
    );

}

    localStorage.setItem(

        "historicoDashboard",

        JSON.stringify(
            historico
        )

    );

    mostrarSucessoLevantamento(
        totalMudas,
        especies.length
    );

}

function mostrarSucessoLevantamento(
    totalMudas,
    totalEspecies
){

    const div =
    document.getElementById(
        "mensagemDashboard"
    );

    div.innerHTML = `

        <h3>
            ✅ Levantamento Registrado
        </h3>

        <p>
            Total de mudas:
            <strong>
                ${totalMudas}
            </strong>
        </p>

        <p>
            Total de espécies:
            <strong>
                ${totalEspecies}
            </strong>
        </p>

        <p>
            Data:
            <strong>
                ${
                    new Date()
                    .toLocaleDateString(
                        "pt-BR"
                    )
                }
            </strong>
        </p>

    `;

    div.style.display =
    "block";

}
function resetarSistema(){

    const confirmar = confirm(
        "Deseja apagar todos os dados de teste?"
    );

    if(!confirmar){
        return;
    }

    localStorage.clear();

    alert(
        "Dados apagados com sucesso!"
    );

    location.reload();

}