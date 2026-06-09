let fileiras = [];

let contagens =
JSON.parse(
localStorage.getItem("contagens")
) || [];

const especies =
JSON.parse(
localStorage.getItem("especies")
) || [];

function carregarEspecies(){

    const select =
    document.getElementById(
        "especieSelect"
    );

    especies.forEach(especie=>{

        select.innerHTML += `
            <option>
                ${especie.nome}
            </option>
        `;

    });

}

function adicionarFileira(){

    const quantidade =
    Number(
        document.getElementById(
            "quantidade"
        ).value
    );

    if(!quantidade){

        alert(
            "Informe uma quantidade."
        );

        return;

    }

    fileiras.push(quantidade);

    atualizarLista();

    document.getElementById(
        "quantidade"
    ).value = "";

}

function atualizarLista(){

    const lista =
    document.getElementById(
        "listaFileiras"
    );

    lista.innerHTML = "";

    let total = 0;

    fileiras.forEach(
        (valor,index)=>{

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
    

    document.getElementById(
        "total"
    ).innerHTML =
    `Total: ${total} mudas`;



    document.getElementById(
        "total"
    ).innerHTML =
    `Total: ${total} mudas`;

}

function salvarContagem(){

    if(fileiras.length === 0){

        alert(
            "Adicione pelo menos uma fileira."
        );

        return;

    }

    const especie =
    document.getElementById(
        "especieSelect"
    ).value;

    const dataPlantio =
    document.getElementById(
        "dataPlantio"
    ).value;
    
    console.log("Data Plantio:", dataPlantio);


    const status =
    document.getElementById(
        "status"
    ).value;

    const observacao =
    document.getElementById(
        "observacao"
    ).value;

    const total =
    fileiras.reduce(
        (a,b)=>a+b,
        0
    );
    
    contagens.push({

        especie,

        dataPlantio,

        status,

        observacao,

        fileiras: [...fileiras],

        total,

        data:
        new Date()
        .toLocaleDateString(
            "pt-BR"
        )

    });

    localStorage.setItem(
        "contagens",
        JSON.stringify(contagens)
    );

    mostrarMensagemSucesso(
        especie,
        total
    );

    fileiras = [];

    atualizarLista();

    document.getElementById(
        "observacao"
    ).value = "";

    document.getElementById(
        "dataPlantio"
    ).value = "";

}
function removerFileira(index){

    const confirmar =
    confirm(
        "Deseja remover esta fileira?"
    );

    if(!confirmar) return;

    fileiras.splice(index,1);

    atualizarLista();

}
function mostrarMensagemSucesso(
    especie,
    total
){

    const caixa =
    document.getElementById(
        "mensagemSucesso"
    );

    const dataAtual =
    new Date()
    .toLocaleDateString(
        "pt-BR"
    );

    caixa.innerHTML = `

        <h3>
            ✅ Contagem salva com sucesso!
        </h3>

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

    caixa.style.display =
    "block";

    setTimeout(()=>{

        caixa.style.display =
        "none";

    },5000);

}
function atualizarDashboard(){

    const contagens =
    JSON.parse(
        localStorage.getItem(
            "contagens"
        )
    ) || [];

    const especies =
    JSON.parse(
        localStorage.getItem(
            "especies"
        )
    ) || [];

    let totalMudas = 0;

    contagens.forEach(c=>{

        totalMudas += c.total;

    });

    const historico =
    JSON.parse(
        localStorage.getItem(
            "historicoDashboard"
        )
    ) || [];

    historico.push({

        dataAtualizacao:
        new Date()
        .toLocaleDateString(
            "pt-BR"
        ),

        totalMudas,

        totalEspecies:
        especies.length,

        especies:
        contagens.map(c=>({

            nome:
            c.especie,

            quantidade:
            c.total,

            dataPlantio:
            c.dataPlantio

        }))

    });

    localStorage.setItem(

        "historicoDashboard",

        JSON.stringify(
            historico
        )

    );

    alert(
        "Dashboard atualizado!"
    );

}

carregarEspecies();