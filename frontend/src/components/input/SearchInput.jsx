import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

function SearchInput({ placeholder = "Buscar...", onSearch }) {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (onSearch) onSearch(value);
    };

    return (
        <div className="w-full py-2 px-5 bg-white rounded-3xl flex items-center gap-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400 transition">
            <SearchIcon className="text-gray-500" />
            <input
                type="search"
                name="search"
                id="search"
                placeholder={placeholder}
                aria-label={placeholder}
                value={query}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-gray-800"
            />
        </div>
    );
}

export default SearchInput;
