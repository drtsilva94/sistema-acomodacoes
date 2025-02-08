import React from 'react';
import './AcomodacaoCard.css';

function AcomodacaoCard({ acomodacao }) {
    const { nome, cidade, preco, imagem } = acomodacao;

    // Definir caminho correto para imagens e imagem padrão
    const imagemFinal = imagem && imagem !== '' ? `/${imagem}` : '/assets/default.jpg';

    // Formatar o preço
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
            <button onClick={alugarAcomodacao} className="alugar-btn">Alugar</button>
        </div>
    );
}

export default AcomodacaoCard;
