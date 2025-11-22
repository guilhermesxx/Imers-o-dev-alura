let cardContainer = document.querySelector(".cards-container");
let dados = [];

async function iniciarBusca() {
    // Buscar dados do JSON se ainda não foram carregados
    if (dados.length === 0) {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    }
    
    // Capturar o termo de busca
    let termoBusca = document.getElementById("caixa-busca").value.toLowerCase().trim();
    
    // Filtrar dados baseado no termo de busca
    let dadosFiltrados;
    if (termoBusca === "") {
        dadosFiltrados = dados;
    } else {
        dadosFiltrados = dados.filter(situacao => 
            situacao.titulo.toLowerCase().includes(termoBusca) ||
            situacao.categoria.toLowerCase().includes(termoBusca) ||
            situacao.descricao.toLowerCase().includes(termoBusca) ||
            situacao.dicas.toLowerCase().includes(termoBusca)
        );
    }
    
    renderizarCards(dadosFiltrados);
}

function renderizarCards(situacoes) {
    cardContainer.innerHTML = "";
    
    if (situacoes.length === 0) {
        cardContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Nenhuma situação encontrada</h3>
                <p>Tente buscar por outros termos como "currículo", "ansiedade" ou "carreira"</p>
            </div>
        `;
        return;
    }
    
    for (let situacao of situacoes) {
        let article = document.createElement("article");
        article.classList.add("card");
        
        // Definir ícone baseado na categoria
        let icone = obterIconePorCategoria(situacao.categoria);
        
        // Definir imagem ou ícone
        let imagemOuIcone;
        if (situacao.imagem && situacao.imagem !== '') {
            imagemOuIcone = `<img src="${situacao.imagem}" alt="${situacao.titulo}" class="card-image">`;
        } else {
            imagemOuIcone = `<div class="card-icon">${icone}</div>`;
        }
        
        article.innerHTML = `
            ${imagemOuIcone}
            <h2>${situacao.titulo}</h2>
            <div class="card-categoria">
                <span class="categoria-badge">${situacao.categoria}</span>
            </div>
            <p class="card-descricao">${situacao.descricao}</p>
            <div class="card-dica">
                <strong>💡 Dica:</strong> ${situacao.dicas}
            </div>
            <a href="${situacao.link}" target="_blank" class="card-link">Saiba mais</a>
        `;
        
        cardContainer.appendChild(article);
    }
}

function obterIconePorCategoria(categoria) {
    const icones = {
        "Carreira": "🚀",
        "Desenvolvimento Pessoal": "🌱",
        "Orientação": "🧠",
        "Organização": "📅",
        "Produtividade": "⚡",
        "Saúde Mental": "💚",
        "Oportunidades": "🎯",
        "Finanças": "💰",
        "Relacionamentos": "🤝"
    };
    return icones[categoria] || "📄";
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar evento de Enter na busca
    document.getElementById("caixa-busca").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            iniciarBusca();
        }
    });
});