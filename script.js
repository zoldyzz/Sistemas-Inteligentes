const API = "http://localhost:3000";

const form = document.getElementById("formProduto");
const tbody = document.getElementById("tbodyProdutos");
const listaAlertas = document.getElementById("listaAlertas");

let produtos = [];

// Carrega os dados ao abrir a página
window.onload = () => {
    carregarProdutos();
};

// Cadastro de produto
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        quantidade: Number(document.getElementById("quantidade").value),
        minimo: Number(document.getElementById("minimo").value),
        valor: Number(document.getElementById("valor").value)
    };

    await fetch(`${API}/produtos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    form.reset();

    carregarProdutos();
});

// Busca os produtos cadastrados
async function carregarProdutos() {

    const resposta = await fetch(`${API}/produtos`);

    produtos = await resposta.json();

    preencherTabela();

    atualizarGraficos(produtos);

    buscarAnalise();
}

// Preenche a tabela
function preencherTabela() {

    tbody.innerHTML = "";

    produtos.forEach(produto => {

        tbody.innerHTML += `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.minimo}</td>
                <td>R$ ${produto.valor.toFixed(2)}</td>
            </tr>
        `;

    });

}

// Busca os alertas inteligentes
async function buscarAnalise() {

    const resposta = await fetch(`${API}/analise`);

    const alertas = await resposta.json();

    listaAlertas.innerHTML = "";

    if (alertas.length === 0) {

        listaAlertas.innerHTML = `
            <div class="alerta verde">
                ✅ Nenhum problema encontrado.
            </div>
        `;

        return;
    }

    alertas.forEach(alerta => {

        let classe = "amarelo";

        if (alerta.tipo === "erro") {
            classe = "vermelho";
        }

        if (alerta.tipo === "sucesso") {
            classe = "verde";
        }

        listaAlertas.innerHTML += `
            <div class="alerta ${classe}">
                ${alerta.mensagem}
            </div>
        `;

    });

}