// components/PokemonList.tsx
import React, { useState, useEffect } from "react";

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
    // Fetch Pokémon data from the API
    const fetchPokemonData = async () => {
      const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`; // Increase limit to a high number

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Fetch details for each Pokémon and create an array
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

        // Set the complete Pokémon list
        setPokemonList(pokemonArray);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemonData();
  }, []);

  useEffect(() => {
    // Filter Pokémon list based on the search term (ID or name)
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
    // Update total pages based on filtered Pokémon list length
    setTotalPages(Math.ceil(filteredPokemonList.length / itemsPerPage));
  }, [filteredPokemonList, itemsPerPage]);

  // Handle next page button click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Handle previous page button click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Paginate the filtered Pokémon list
  const paginatedPokemonList = filteredPokemonList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
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
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {paginatedPokemonList.map(pokemon => (
          <div key={pokemon.id} className="bg-white shadow-md rounded-lg p-4 text-left">
            <img src={pokemon.sprite} alt={pokemon.name} className="mx-auto" />
            <h3 className="text-lg text-black font-semibold">{pokemon.name}</h3>
            <p className="text-gray-600">#{pokemon.id}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default PokemonList;

