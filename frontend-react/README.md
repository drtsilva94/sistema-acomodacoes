# 🏡 Sistema de Acomodações

Este projeto é uma aplicação web para listagem de acomodações. Ele utiliza uma API construída com **FastAPI** no back-end e um front-end desenvolvido com **React**.

---

## 📦 Estrutura do Projeto

```plaintext
sistema-acomodacoes/
│
├── api/                 # Back-end (FastAPI)
│   ├── main.py          # Ponto de entrada da API
│   ├── models.py        # Definição dos modelos do banco de dados
│   ├── dados.json       # Dados de exemplo (caso não use o banco)
│   ├── acomodacoes.db   # Banco de dados SQLite (se preferir essa abordagem)
│   └── __pycache__/     # Cache do Python
│
├── frontend-react/      # Front-end (React)
│   ├── public/          # Arquivos públicos (imagens, ícones, etc.)
│   ├── src/             # Código-fonte do React
│   │   ├── components/  # Componentes reutilizáveis (Card, Mapa, SearchBar)
│   │   ├── App.js       # Componente principal da aplicação
│   │   ├── App.css      # Estilização global
│   │   └── index.js     # Arquivo principal de inicialização
│
├── README.md            # Documentação do projeto
└── .gitignore           # Arquivos a serem ignorados pelo Git
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/sistema-acomodacoes.git
```

### 2. Acesse o diretório do projeto:

```bash
cd sistema-acomodacoes
```

---

## 🔧 Configuração do Back-end (API FastAPI)

### 1. Acesse o diretório da API:

```bash
cd api
```

### 2. Crie e ative um ambiente virtual:

```bash
python -m venv env
source env/bin/activate  # No Windows: .\env\Scripts\activate
```

### 3. Instale as dependências:

```bash
pip install -r requirements.txt
```

### 4. Inicie a API:

```bash
uvicorn main:app --reload
```

- Acesse a API no navegador em: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
- Para a documentação interativa: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🌐 Configuração do Front-end (React)

### 1. Acesse o diretório do front-end:

```bash
cd frontend-react
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

- Acesse a aplicação no navegador: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tecnologias Utilizadas

- **FastAPI** para a criação da API  
- **React** para o front-end  
- ****MySQL** para persistência de dados  
- **Leaflet** para renderização de mapas  
- **CSS personalizado** para estilização  

---

## 🌱 Como Contribuir

### 1. Faça um fork do repositório:

```bash
git fork https://github.com/seu-usuario/sistema-acomodacoes.git
```

### 2. Crie uma nova branch para suas alterações:

```bash
git checkout -b minha-feature
```

### 3. Faça suas alterações e crie commits claros:

```bash
git commit -m "Minha nova feature"
```

### 4. Envie para o seu repositório forkado:

```bash
git push origin minha-feature
```

### 5. Abra um Pull Request neste repositório original.
