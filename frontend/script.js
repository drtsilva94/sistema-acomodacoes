// URL base da API
const API_URL = "http://127.0.0.1:8000/acomodacoes";

// Carregar acomodações ao carregar a página
window.onload = carregarAcomodacoes;

// Função para buscar e exibir as acomodações
function carregarAcomodacoes() {
    const lista = document.getElementById('acomodacoes-lista');
    lista.innerHTML = "<p>Carregando acomodações...</p>";  // Loader temporário

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar acomodações da API.');
            }
            return response.json();
        })
        .then(data => {
            lista.innerHTML = "";  // Limpar a lista após o carregamento

            if (data.length === 0) {
                lista.innerHTML = "<p>Nenhuma acomodação disponível no momento.</p>";
                return;
            }

            data.forEach(acomodacao => {
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
                        <button class="editar-btn" onclick="editarAcomodacao(${acomodacao.id})">Editar</button>
                        <button class="excluir-btn" onclick="deletarAcomodacao(${acomodacao.id})">Excluir</button>
                    </div>
                `;
                lista.appendChild(card);
            });
        })
        .catch(error => {
            lista.innerHTML = `<p class="erro">Erro: ${error.message}</p>`;
        });
}

// Função para abrir o formulário no modo de edição
function editarAcomodacao(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar a acomodação.');
            }
            return response.json();
        })
        .then(acomodacao => {
            document.getElementById('id-acomodacao').value = id;
            document.getElementById('nome').value = acomodacao.nome;
            document.getElementById('cidade').value = acomodacao.cidade;
            document.getElementById('preco').value = acomodacao.preco;
            document.getElementById('imagem').value = acomodacao.imagem;
            abrirModal('Editar Acomodação');
        })
        .catch(error => alert('Erro ao carregar acomodação: ' + error.message));
}

// Função para deletar uma acomodação
function deletarAcomodacao(id) {
    if (confirm("Tem certeza de que deseja excluir esta acomodação?")) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir a acomodação.');
            }
            return response.json();
        })
        .then(() => {
            alert("Acomodação excluída com sucesso!");
            carregarAcomodacoes();
        })
        .catch(error => alert('Erro ao excluir acomodação: ' + error.message));
    }
}

// Função para abrir o modal de formulário
function abrirModal(titulo) {
    document.getElementById('modal-titulo').innerText = titulo;
    document.getElementById('modal').style.display = 'flex';
}

// Fechar modal ao clicar no "x"
document.getElementById('fechar-modal').onclick = function() {
    document.getElementById('modal').style.display = 'none';
    limparFormulario();
}

// Submeter o formulário
document.getElementById('form-acomodacao').onsubmit = function(event) {
    event.preventDefault();

    const id = document.getElementById('id-acomodacao').value;
    const novaAcomodacao = {
        nome: document.getElementById('nome').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        preco: parseFloat(document.getElementById('preco').value),
        imagem: document.getElementById('imagem').value.trim()
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAcomodacao)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao ${id ? 'atualizar' : 'adicionar'} a acomodação.`);
        }
        return response.json();
    })
    .then(() => {
        alert(`Acomodação ${id ? 'atualizada' : 'adicionada'} com sucesso!`);
        carregarAcomodacoes();
    })
    .catch(error => alert('Erro: ' + error.message));

    document.getElementById('modal').style.display = 'none';
    limparFormulario();
}

// Função para limpar o formulário após envio ou ao fechar o modal
function limparFormulario() {
    document.getElementById('form-acomodacao').reset();
    document.getElementById('id-acomodacao').value = "";
}
