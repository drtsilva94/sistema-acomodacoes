import React from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, cidade }) {
    const handleChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <input
            type="text"
            id="filtro-cidade"
            placeholder="Buscar por cidade..."
            value={cidade}
            onChange={handleChange}
        />
    );
}

export default SearchBar;
