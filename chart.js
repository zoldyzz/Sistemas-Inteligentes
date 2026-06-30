let graficoBarra = null;
let graficoPizza = null;

function atualizarGraficos(produtos) {

    const nomes = [];
    const quantidades = [];

    const categorias = {};
    
    produtos.forEach(produto => {

        // Dados do gráfico de barras
        nomes.push(produto.nome);
        quantidades.push(produto.quantidade);

        // Dados do gráfico de pizza
        if (categorias[produto.categoria]) {
            categorias[produto.categoria]++;
        } else {
            categorias[produto.categoria] = 1;
        }

    });

    // Destrói os gráficos antigos antes de criar novos
    if (graficoBarra) {
        graficoBarra.destroy();
    }

    if (graficoPizza) {
        graficoPizza.destroy();
    }

    // ==========================
    // Gráfico de Barras
    // ==========================

    const ctxBarra = document
        .getElementById("graficoBarra")
        .getContext("2d");

    graficoBarra = new Chart(ctxBarra, {

        type: "bar",

        data: {

            labels: nomes,

            datasets: [{

                label: "Quantidade em Estoque",

                data: quantidades,

                backgroundColor: [
                    "#3498db",
                    "#2ecc71",
                    "#f1c40f",
                    "#9b59b6",
                    "#e74c3c",
                    "#1abc9c",
                    "#34495e",
                    "#e67e22"
                ],

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                },

                title: {
                    display: true,
                    text: "Quantidade por Produto"
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        stepSize: 1
                    }

                }

            }

        }

    });

    // ==========================
    // Gráfico de Pizza
    // ==========================

    const ctxPizza = document
        .getElementById("graficoPizza")
        .getContext("2d");

    graficoPizza = new Chart(ctxPizza, {

        type: "pie",

        data: {

            labels: Object.keys(categorias),

            datasets: [{

                data: Object.values(categorias),

                backgroundColor: [
                    "#3498db",
                    "#2ecc71",
                    "#f39c12",
                    "#9b59b6",
                    "#e74c3c",
                    "#1abc9c",
                    "#34495e",
                    "#d35400"
                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                title: {

                    display: true,

                    text: "Produtos por Categoria"

                }

            }

        }

    });

}