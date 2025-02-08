import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import './AcomodacaoCard.css';

function AcomodacaoCard({ acomodacao }) {
    const { id, nome, cidade, preco, imagem } = acomodacao;

    // Verificar se o ID da acomodação está salvo no localStorage inicialmente
    const [favorito, setFavorito] = useState(() => {
        const favoritosSalvos = JSON.parse(localStorage.getItem('favoritos')) || [];
        return Array.isArray(favoritosSalvos) && favoritosSalvos.includes(id);
    });

    // Atualiza o localStorage sempre que o estado favorito mudar
    useEffect(() => {
        let favoritosSalvos = JSON.parse(localStorage.getItem('favoritos')) || [];

        // Garantir que seja sempre um array
        if (!Array.isArray(favoritosSalvos)) {
            favoritosSalvos = [];
        }

        if (favorito) {
            if (!favoritosSalvos.includes(id)) {
                favoritosSalvos.push(id); // Adiciona o ID se não estiver presente
            }
        } else {
            favoritosSalvos = favoritosSalvos.filter(favId => favId !== id); // Remove o ID se desfavoritado
        }

        localStorage.setItem('favoritos', JSON.stringify(favoritosSalvos));
    }, [favorito, id]);

    const toggleFavorito = () => {
        setFavorito(!favorito);
    };

    const imagemFinal = imagem && imagem !== '' ? `/${imagem}` : '/assets/default.jpg';

    const precoFormatado = `R$ ${preco.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} por noite`;

    const alugarAcomodacao = () => {
        alert(`Você selecionou a acomodação: ${nome}`);
    };

    return (
        <div className="acomodacao-card">
            <div className="imagem-container">
                <img src={imagemFinal} alt={`Imagem de ${nome}`} className="imagem-principal" />
            </div>
            <h3>{nome}</h3>
            <p>Cidade: {cidade}</p>
            <p>Preço: {precoFormatado}</p>
            <div className="acomodacao-footer">
                <button onClick={alugarAcomodacao} className="alugar-btn">Alugar</button>
                <FaStar
                    className={`estrela-favorito ${favorito ? 'ativo' : ''}`}
                    onClick={toggleFavorito}
                />
            </div>
        </div>
    );
}

export default AcomodacaoCard;
