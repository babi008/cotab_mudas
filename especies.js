
let especies =
JSON.parse(
localStorage.getItem("especies")
) || [];

/*
=========================
SALVAR
=========================
*/

function salvarDados(){

    localStorage.setItem(
        "especies",
        JSON.stringify(especies)
    );

}

/*
=========================
CADASTRAR
=========================
*/

function cadastrarEspecie(){

    const campo =
    document.getElementById(
        "nomeEspecie"
    );

    const nome =
    campo.value.trim();

    if(nome === ""){

        alert(
            "Digite o nome da espécie."
        );

        return;

    }

    const existe =
    especies.some(
        especie =>
        especie.nome.toLowerCase()
        === nome.toLowerCase()
    );

    if(existe){

        alert(
            "Essa espécie já existe."
        );

        return;

    }

    especies.push({

        nome: nome

    });

    salvarDados();

    renderizarEspecies();

    campo.value = "";

}

/*
=========================
EDITAR
=========================
*/

function editarEspecie(index){

    const novoNome =
    prompt(
        "Editar espécie:",
        especies[index].nome
    );

    if(!novoNome) return;

    const nome =
    novoNome.trim();

    if(nome === ""){

        alert(
            "Nome inválido."
        );

        return;

    }

    const duplicada =
    especies.some(
        (e,i)=>

        i !== index &&

        e.nome.toLowerCase()
        === nome.toLowerCase()
    );

    if(duplicada){

        alert(
            "Já existe uma espécie com esse nome."
        );

        return;

    }

    especies[index].nome =
    nome;

    salvarDados();

    renderizarEspecies();

}

/*
=========================
EXCLUIR
=========================
*/

function excluirEspecie(index){

    const confirmar =
    confirm(
        "Deseja excluir esta espécie?"
    );

    if(!confirmar) return;

    especies.splice(index,1);

    salvarDados();

    renderizarEspecies();

}

/*
=========================
LISTAR
=========================
*/

function renderizarEspecies(){

    const lista =
    document.getElementById(
        "listaEspecies"
    );

    lista.innerHTML = "";

    especies.forEach(
        (especie,index)=>{

        lista.innerHTML += `

        <tr>

            <td>
                ${index + 1}
            </td>

            <td>
                🌱 ${especie.nome}
            </td>

            <td>

                <button
                    class="btn-editar"
                    onclick="editarEspecie(${index})">

                    Editar

                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirEspecie(${index})">

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

renderizarEspecies();