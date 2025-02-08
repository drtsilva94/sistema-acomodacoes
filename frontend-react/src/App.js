import React, { useState, useEffect } from 'react';
import AcomodacaoCard from './components/AcomodacaoCard';
import SearchBar from './components/SearchBar';
import Mapa from './components/Mapa';
import './App.css';

const API_URL = "http://127.0.0.1:8000/acomodacoes";

function App() {
    const [acomodacoes, setAcomodacoes] = useState([]);
    const [cidade, setCidade] = useState("");

    useEffect(() => {
        carregarAcomodacoes();
    }, []);

    const carregarAcomodacoes = (url = API_URL) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar as acomodações.');
                }
                return response.json();
            })
            .then(data => setAcomodacoes(data))
            .catch(error => console.error(error));
    };

    const handleSearch = (cidade) => {
        setCidade(cidade);
        const urlComFiltro = cidade ? `${API_URL}?cidade=${encodeURIComponent(cidade)}` : API_URL;
        carregarAcomodacoes(urlComFiltro);
    };

    return (
        <div className="app">
            <header className="main-header">
                <SearchBar onSearch={handleSearch} cidade={cidade} />
            </header>
            <div className="conteudo">
                <div id="acomodacoes-lista">
                    {acomodacoes.length > 0 ? (
                        acomodacoes.map(acomodacao => (
                            <AcomodacaoCard key={acomodacao.nome} acomodacao={acomodacao} />
                        ))
                    ) : (
                        <p>Nenhuma acomodação encontrada.</p>
                    )}
                </div>
                <Mapa acomodacoes={acomodacoes} />
            </div>
        </div>
    );
}

export default App;
