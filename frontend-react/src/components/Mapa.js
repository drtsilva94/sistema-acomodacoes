import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

function Mapa({ acomodacoes }) {
    useEffect(() => {
        const mapa = L.map('mapa').setView([-27.5954, -48.548], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);

        // Adicionar marcadores
        acomodacoes.forEach(acomodacao => {
            const coordenadas = obterCoordenadasPorCidade(acomodacao.cidade);
            if (coordenadas) {
                L.marker(coordenadas)
                    .addTo(mapa)
                    .bindPopup(`<strong>${acomodacao.nome}</strong><br>${acomodacao.cidade}<br>R$ ${acomodacao.preco.toFixed(2)}`);
            }
        });

        return () => mapa.remove(); // Limpar mapa ao desmontar o componente
    }, [acomodacoes]);

    const obterCoordenadasPorCidade = (cidade) => {
        const coordenadasCidades = {
            "Florianópolis": [-27.5954, -48.548],
            "Recife": [-8.0476, -34.877],
            "Balneário Camboriú": [-26.9902, -48.6358]
        };
        return coordenadasCidades[cidade] || null;
    };

    return <div id="mapa" className="mapa"></div>;
}

export default Mapa;
