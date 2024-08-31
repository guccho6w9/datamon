import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "@/components/Layout/footer";
import "@/app/globals.css";
import WeaknessTable from "@/components/Pokemon/weakness";

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
              (abilityEntry: {
                ability: { name: string };
                is_hidden: boolean;
              }) => ({
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

  // Calculating total stats
  const totalStats = pokemon.stats.reduce(
    (total, stat) => total + stat.base_stat,
    0
  );

  // Function to determine the color of the progress bar based on stat value
  const getColor = (stat: number) => {
    if (stat >= 170) return "bg-teal-400";
    if (stat >= 100) return "bg-green-500";
    if (stat >= 70) return "bg-yellow-500";
    if (stat < 70) return "bg-red-500";
    return "bg-red-500";
  };

  // Function to determine the color of the type circle
  const getTypeColor = (type: string) => {
    switch (type) {
      case "fire":
        return "bg-red-500";
      case "water":
        return "bg-sky-400";
      case "grass":
        return "bg-green-500";
      case "electric":
        return "bg-yellow-400";
      case "ice":
        return "bg-teal-300";
      case "fighting":
        return "bg-orange-500";
      case "poison":
        return "bg-fuchsia-800";
      case "ground":
        return "bg-yellow-700";
      case "flying":
        return "bg-blue-200";
      case "psychic":
        return "bg-pink-500";
      case "bug":
        return "bg-green-700";
      case "rock":
        return "bg-yellow-800";
      case "ghost":
        return "bg-purple-900";
      case "dragon":
        return "bg-purple-800";
      case "dark":
        return "bg-gray-900";
      case "steel":
        return "bg-gray-500";
      case "fairy":
        return "bg-pink-300";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen p-4">
      {/* Botón de flecha para regresar */}
      <button
        className="mb-4 p-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-600"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
        {/* Pokémon card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg md:w-1/2">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-1/3 mx-auto"
          />
          <h1 className="text-3xl font-bold text-center">{pokemon.name}</h1>
          <p className="text-center text-gray-400">#{pokemon.id}</p>
          <div className="flex justify-center space-x-2 mt-4">
            {pokemon.types.map((type, index) => (
              <span
                key={index}
                className="flex items-center bg-gray-600 rounded-full px-4 py-1 text-white"
              >
                <div
                  className={`w-6 h-6 ${getTypeColor(
                    type
                  )} rounded-full flex items-center justify-center mr-2`}
                >
                  <img
                    src={`/images/type_icons/${type}.svg`}
                    alt={`${type} icon`}
                    className="w-4 h-4"
                  />
                </div>
                <span className="text-sm">{type}</span>
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
            <source
              src={`https://pokemoncries.com/cries/${pokemon.id}.mp3`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* Stats card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg md:w-1/2">
          <h2 className="text-2xl font-bold text-center">Stats</h2>
          <ul className="mt-4 space-y-2">
            {pokemon.stats.map((stat, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="w-1/3">{stat.name}</span>
                <span className="w-1/12">{stat.base_stat}</span>
                <div className="w-2/3 bg-gray-300 rounded-full h-4 ml-2">
                  <div
                    className={`${getColor(
                      stat.base_stat
                    )} h-full rounded-full`}
                    style={{ width: `${(stat.base_stat / 250) * 100}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-center font-bold">Total: {totalStats}</div>
          <WeaknessTable types={pokemon.types} />
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default PokemonDetail;
