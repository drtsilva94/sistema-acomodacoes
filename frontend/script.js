// URL base da API
const API_URL = "http://127.0.0.1:8000/acomodacoes";

// Inicializar o mapa usando Leaflet
let mapa;
function inicializarMapa() {
    mapa = L.map('mapa').setView([-27.5954, -48.548], 8); // Posição inicial (Florianópolis)

    // Adicionar camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
}

// Carregar acomodações ao carregar a página e inicializar o mapa
window.onload = function () {
    inicializarMapa();
    carregarAcomodacoes();
};

// Função para buscar e exibir as acomodações
function carregarAcomodacoes() {
    const lista = document.getElementById('acomodacoes-lista');
    lista.innerHTML = "<p>Carregando acomodações...</p>"; // Loader temporário

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar acomodações da API.');
            }
            return response.json();
        })
        .then(data => {
            lista.innerHTML = ""; // Limpar a lista após o carregamento
            if (data.length === 0) {
                lista.innerHTML = "<p>Nenhuma acomodação disponível no momento.</p>";
                return;
            }

            data.forEach(acomodacao => {
                // Criar card de acomodação
                const card = document.createElement('div');
                card.className = "acomodacao-card";

                card.innerHTML = `
                    <div class="imagem-container">
                        <img class="imagem-principal" src="${acomodacao.imagem}" alt="Imagem de ${acomodacao.nome}">
                    </div>
                    <h3>${acomodacao.nome}</h3>
                    <p>Cidade: ${acomodacao.cidade}</p>
                    <p>Preço: R$ ${acomodacao.preco.toFixed(2)}</p>
                    <div class="botoes-acomodacao">
                        <button class="alugar-btn" onclick="alugarAcomodacao('${acomodacao.nome}')">Alugar</button>
                    </div>
                `;
                lista.appendChild(card);

                // Adicionar marcador no mapa
                adicionarMarcadorNoMapa(acomodacao);
            });
        })
        .catch(error => {
            lista.innerHTML = `<p class="erro">Erro: ${error.message}</p>`;
        });
}

// Função para exibir uma mensagem de aluguel
function alugarAcomodacao(nome) {
    alert(`Você selecionou a acomodação: ${nome}. Por favor, finalize a reserva.`);
}

// Função para adicionar marcadores no mapa usando coordenadas fictícias para exemplo
function adicionarMarcadorNoMapa(acomodacao) {
    // Coordenadas fictícias por agora, você pode adaptar para usar uma API real de geocodificação
    const coordenadas = obterCoordenadasPorCidade(acomodacao.cidade);

    if (coordenadas) {
        const marcador = L.marker(coordenadas)
            .addTo(mapa)
            .bindPopup(`<strong>${acomodacao.nome}</strong><br>${acomodacao.cidade}<br>R$ ${acomodacao.preco.toFixed(2)}`)
            .openPopup();
    } else {
        console.warn(`Coordenadas não encontradas para a cidade: ${acomodacao.cidade}`);
    }
}

// Função fictícia para retornar coordenadas com base na cidade
function obterCoordenadasPorCidade(cidade) {
    const coordenadasCidades = {
        "Florianópolis": [-27.5954, -48.548],
        "Recife": [-8.0476, -34.877],
        "Balneário Camboriú": [-26.9902, -48.6358]
    };

    return coordenadasCidades[cidade] || null;
}
