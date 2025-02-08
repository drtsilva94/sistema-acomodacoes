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
    
    // Adicionar evento ao campo de busca
    document.getElementById('filtro-cidade').addEventListener('input', (e) => {
        const cidade = e.target.value.trim();
        if (cidade !== "") {
            filtrarAcomodacoes(cidade);
        } else {
            carregarAcomodacoes(); // Se o campo de busca estiver vazio, carregar tudo
        }
    });
};

// Função para buscar e exibir todas as acomodações
function carregarAcomodacoes() {
    fetchAcomodacoes(API_URL);
}

// Função para buscar acomodações por cidade
function filtrarAcomodacoes(cidade) {
    const urlComFiltro = `${API_URL}?cidade=${encodeURIComponent(cidade)}`;
    fetchAcomodacoes(urlComFiltro);
}

// Função genérica para buscar e exibir acomodações
function fetchAcomodacoes(url) {
    const lista = document.getElementById('acomodacoes-lista');
    lista.innerHTML = "<p>Carregando acomodações...</p>"; // Loader temporário

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar acomodações da API.');
            }
            return response.json();
        })
        .then(data => {
            lista.innerHTML = ""; // Limpar a lista após o carregamento

            // Verificar se há dados
            if (data.length === 0) {
                lista.innerHTML = "<p>Nenhuma acomodação disponível no momento para a busca realizada.</p>";
                return;
            }

            // Limpar marcadores no mapa
            mapa.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapa.removeLayer(layer);
                }
            });

            // Criar os cards e adicionar marcadores
            data.forEach(acomodacao => {
                criarCardAcomodacao(acomodacao);
                adicionarMarcadorNoMapa(acomodacao);
            });
        })
        .catch(error => {
            lista.innerHTML = `<p class="erro">Erro: ${error.message}</p>`;
        });
}

// Função para criar e exibir um card de acomodação
function criarCardAcomodacao(acomodacao) {
    // Verificar se a acomodação está nos favoritos
    const isFavorito = verificarFavorito(acomodacao.nome);

    // Imagem padrão se não houver imagem definida
    const imagem = acomodacao.imagem || "assets/default.jpg";

    // Criar card de acomodação
    const card = document.createElement('div');
    card.className = "acomodacao-card";

    card.innerHTML = `
        <div class="imagem-container">
            <img class="imagem-principal" src="${imagem}" alt="Imagem de ${acomodacao.nome}">
        </div>
        <h3>${acomodacao.nome}</h3>
        <p>Cidade: ${acomodacao.cidade}</p>
        <p>Preço: R$ ${acomodacao.preco.toFixed(2)}</p>
        <div class="botoes-acomodacao">
            <button class="alugar-btn" onclick="alugarAcomodacao('${acomodacao.nome}')">Alugar</button>
            <span class="favoritar-icon ${isFavorito ? 'favorito' : ''}" 
                  onclick="alternarFavorito('${acomodacao.nome}')">&#9733;</span>
        </div>
    `;
    document.getElementById('acomodacoes-lista').appendChild(card);
}

// Função para exibir uma mensagem de aluguel
function alugarAcomodacao(nome) {
    alert(`Você selecionou a acomodação: ${nome}. Por favor, finalize a reserva.`);
}

// Função para adicionar marcadores no mapa usando coordenadas fictícias para exemplo
function adicionarMarcadorNoMapa(acomodacao) {
    const coordenadas = obterCoordenadasPorCidade(acomodacao.cidade);

    if (coordenadas) {
        L.marker(coordenadas)
            .addTo(mapa)
            .bindPopup(`<strong>${acomodacao.nome}</strong><br>${acomodacao.cidade}<br>R$ ${acomodacao.preco.toFixed(2)}`);
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

// Função para verificar se a acomodação já está nos favoritos
function verificarFavorito(nome) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    return favoritos.includes(nome);
}

// Função para alternar o status de favorito
function alternarFavorito(nome) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.includes(nome)) {
        // Se já estiver nos favoritos, remover
        favoritos = favoritos.filter(favorito => favorito !== nome);
    } else {
        // Caso contrário, adicionar aos favoritos
        favoritos.push(nome);
    }

    // Atualizar no localStorage
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    // Recarregar os cards para refletir a mudança
    carregarAcomodacoes();
}

// Função para adicionar uma nova acomodação via API
function adicionarAcomodacao() {
    const nome = document.getElementById('nome').value;
    const cidade = document.getElementById('cidade').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const imagem = document.getElementById('imagem').value;

    const novaAcomodacao = {
        nome: nome,
        cidade: cidade,
        preco: preco,
        imagem: imagem || null
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaAcomodacao)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar acomodação.');
        }
        return response.json();
    })
    .then(() => {
        alert('Acomodação adicionada com sucesso!');
        
        // Limpar os campos do formulário
        document.getElementById('form-adicionar').reset();

        // Recarregar a lista de acomodações
        carregarAcomodacoes();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao adicionar a acomodação.');
    });
}
