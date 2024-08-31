// components/PokemonList.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link"; // import for intern links

type Pokemon = {
  id: number;
  name: string;
  sprite: string;
};

type PokemonApiResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
};

const PokemonList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(15);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const pokemonArray = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData: PokemonApiResponse = await pokemonResponse.json();
            return {
              id: pokemonData.id,
              name: pokemonData.name,
              sprite: pokemonData.sprites.front_default,
            };
          })
        );

        setPokemonList(pokemonArray);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemonData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();

      const filteredList = pokemonList.filter(pokemon => {
        const idMatches = pokemon.id.toString().includes(lowercasedTerm);
        const nameMatches = pokemon.name.toLowerCase().includes(lowercasedTerm);
        return idMatches || nameMatches;
      });

      setFilteredPokemonList(filteredList);
      setCurrentPage(1); // Reset page to 1 for new search
    } else {
      setFilteredPokemonList(pokemonList);
    }
  }, [searchTerm, pokemonList]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPokemonList.length / itemsPerPage));
  }, [filteredPokemonList, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const paginatedPokemonList = filteredPokemonList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-4">
      <div className="flex justify-between mb-4 mx-4">
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

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-5 mb-10">
        {paginatedPokemonList.map(pokemon => (
          <Link legacyBehavior key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
            <a className="bg-white shadow-md rounded-lg p-4 text-left">
              <img src={pokemon.sprite} alt={pokemon.name} className="mx-auto" />
              <h3 className="text-lg text-black font-semibold">{pokemon.name}</h3>
              <p className="text-gray-600">#{pokemon.id}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
