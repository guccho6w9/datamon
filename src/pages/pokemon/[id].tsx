// pages/pokemon/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Ability = {
    name: string;
    is_hidden: boolean;
  };
  
  type Stat = {
    name: string;
    base_stat: number;
  };
  
  type Pokemon = {
    id: number;
    name: string;
    sprite: string;
    types: string[];
    abilities: Ability[];
    weight: number;
    stats: Stat[];
  };
  

const PokemonDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPokemonData = async () => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          const data = await response.json();
          const pokemonData: Pokemon = {
            id: data.id,
            name: data.name,
            sprite: data.sprites.front_default,
            types: data.types.map(
              (typeEntry: { type: { name: string } }) => typeEntry.type.name
            ),
            abilities: data.abilities.map(
              (abilityEntry: { ability: { name: string }; is_hidden: boolean }) => ({
                name: abilityEntry.ability.name,
                is_hidden: abilityEntry.is_hidden,
              })
            ),
            weight: data.weight,
            stats: data.stats.map(
              (statEntry: { stat: { name: string }; base_stat: number }) => ({
                name: statEntry.stat.name,
                base_stat: statEntry.base_stat,
              })
            ),
          };
          setPokemon(pokemonData);
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
        }
      };

      fetchPokemonData();
    }
  }, [id]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex space-x-8">
        {/* Pokémon card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <img src={pokemon.sprite} alt={pokemon.name} className="w-64 h-64 mx-auto" />
          <h1 className="text-3xl font-bold text-center">{pokemon.name}</h1>
          <p className="text-center text-gray-400">#{pokemon.id}</p>
          <div className="flex justify-center space-x-2 mt-4">
            {pokemon.types.map((type, index) => (
              <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded">
                {type}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Abilities</h2>
            <ul className="list-disc ml-5">
              {pokemon.abilities.map((ability, index) => (
                <li key={index}>
                  {ability.name} {ability.is_hidden && "(Hidden Ability)"}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4">Weight: {pokemon.weight / 10} kg</p>
          <audio controls className="mt-4 w-full">
            <source src={`https://pokemoncries.com/cries/${pokemon.id}.mp3`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* stats card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center">Stats</h2>
          <ul className="mt-4">
            {pokemon.stats.map((stat, index) => (
              <li key={index} className="flex justify-between">
                <span>{stat.name}</span>
                <span>{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;