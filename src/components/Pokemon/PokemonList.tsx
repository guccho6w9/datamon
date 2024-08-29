import React, { useState, useEffect } from "react";


type Pokemon = {
  id: number;
  name: string;
  sprite: string;
};

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`);
      const data = await response.json();
      const pokemonArray = await Promise.all(data.results.map(async (pokemon: { name: string; url: string }) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default,
        };
      }));
      setPokemonList(pokemonArray);
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    };

    fetchPokemonData();
  }, [currentPage, itemsPerPage]);

  const handleNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {pokemonList.map((pokemon) => (
          <div key={pokemon.id} className="bg-white shadow-md rounded-lg p-4 text-center">
            <img src={pokemon.sprite} alt={pokemon.name} className="mx-auto" />
            <p className="text-gray-600">#{pokemon.id}</p>
            <h3 className="text-lg font-semibold">{pokemon.name}</h3>
            
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
