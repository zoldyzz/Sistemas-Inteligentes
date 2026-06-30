const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const arquivo = path.join(__dirname, "produtos.json");

// Cria o arquivo caso ele não exista
if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, "[]");
}

// ================================
// LISTAR PRODUTOS
// ================================

app.get("/produtos", (req, res) => {

    const dados = fs.readFileSync(arquivo);

    const produtos = JSON.parse(dados);

    res.json(produtos);

});

// ================================
// CADASTRAR PRODUTO
// ================================

app.post("/produtos", (req, res) => {

    const novoProduto = req.body;

    const dados = fs.readFileSync(arquivo);

    const produtos = JSON.parse(dados);

    produtos.push(novoProduto);

    fs.writeFileSync(
        arquivo,
        JSON.stringify(produtos, null, 4)
    );

    res.status(201).json({
        mensagem: "Produto cadastrado com sucesso!"
    });

});

// ================================
// ANÁLISE INTELIGENTE
// ================================

app.get("/analise", (req, res) => {

    const dados = fs.readFileSync(arquivo);

    const produtos = JSON.parse(dados);

    let alertas = [];

    // =====================
    // REGRA 1
    // Estoque abaixo do mínimo
    // =====================

    produtos.forEach(produto => {

        if (produto.quantidade <= produto.minimo) {

            alertas.push({

                tipo: "erro",

                mensagem:
                `⚠ O produto "${produto.nome}" está abaixo do estoque mínimo.`

            });

        }

    });

    // =====================
    // REGRA 2
    // Categoria com mais produtos
    // =====================

    let categorias = {};

    produtos.forEach(produto => {

        if (categorias[produto.categoria]) {

            categorias[produto.categoria]++;

        } else {

            categorias[produto.categoria] = 1;

        }

    });

    let maiorCategoria = "";
    let maiorQuantidade = 0;

    for (let categoria in categorias) {

        if (categorias[categoria] > maiorQuantidade) {

            maiorQuantidade = categorias[categoria];
            maiorCategoria = categoria;

        }

    }

    if (maiorCategoria !== "") {

        alertas.push({

            tipo: "sucesso",

            mensagem:
            `📦 A categoria "${maiorCategoria}" possui o maior número de produtos.`

        });

    }

    // =====================
    // REGRA 3
    // Valor total do estoque
    // =====================

    let valorTotal = 0;

    produtos.forEach(produto => {

        valorTotal += produto.quantidade * produto.valor;

    });

    if (valorTotal > 10000) {

        alertas.push({

            tipo: "amarelo",

            mensagem:
            `💰 O estoque possui valor superior a R$ 10.000,00.`

        });

    }

    res.json(alertas);

});

// ================================

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("Servidor iniciado!");
    console.log(`http://localhost:${PORT}`);
    console.log("--------------------------------");

});