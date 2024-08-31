import React from "react";
import "@/app/globals.css";
// Mapa de efectividad de tipos
const typeEffectiveness: {
  [key: string]: {
    strongAgainst: string[];
    weakAgainst: string[];
    immuneTo?: string[];
  };
} = {
  normal: { strongAgainst: [], weakAgainst: ["fighting"], immuneTo: ["ghost"] },
  fire: {
    strongAgainst: ["grass", "ice", "bug", "steel"],
    weakAgainst: ["water", "rock", "ground"],
  },
  water: {
    strongAgainst: ["fire", "rock", "ground"],
    weakAgainst: ["electric", "grass"],
  },
  grass: {
    strongAgainst: ["water", "rock", "ground"],
    weakAgainst: ["fire", "ice", "flying", "bug"],
  },
  electric: { strongAgainst: ["water", "flying"], weakAgainst: ["ground"] },
  ice: {
    strongAgainst: ["grass", "ground", "flying", "dragon"],
    weakAgainst: ["fire", "fighting", "rock", "steel"],
  },
  fighting: {
    strongAgainst: ["normal", "ice", "rock", "dark", "steel"],
    weakAgainst: ["flying", "psychic", "fairy"],
  },
  poison: {
    strongAgainst: ["grass", "fairy"],
    weakAgainst: ["ground", "psychic"],
  },
  ground: {
    strongAgainst: ["fire", "electric", "poison", "rock", "steel"],
    weakAgainst: ["water", "ice", "grass"],
    immuneTo: ["electric"],
  },
  flying: {
    strongAgainst: ["grass", "fighting", "bug"],
    weakAgainst: ["electric", "ice", "rock"],
    immuneTo: ["ground"],
  },
  psychic: {
    strongAgainst: ["fighting", "poison"],
    weakAgainst: ["bug", "ghost", "dark"],
  },
  bug: {
    strongAgainst: ["grass", "psychic", "dark"],
    weakAgainst: ["fire", "flying", "rock"],
  },
  rock: {
    strongAgainst: ["fire", "ice", "flying", "bug"],
    weakAgainst: ["water", "grass", "fighting", "ground", "steel"],
  },
  ghost: {
    strongAgainst: ["psychic", "ghost"],
    weakAgainst: ["ghost", "dark"],
    immuneTo: ["normal", "fighting"],
  },
  dragon: {
    strongAgainst: ["dragon"],
    weakAgainst: ["ice", "dragon", "fairy"],
  },
  dark: {
    strongAgainst: ["psychic", "ghost"],
    weakAgainst: ["fighting", "bug", "fairy"],
  },
  steel: {
    strongAgainst: ["ice", "rock", "fairy"],
    weakAgainst: ["fire", "fighting", "ground"],
    immuneTo: ["poison"],
  },
  fairy: {
    strongAgainst: ["fighting", "dragon", "dark"],
    weakAgainst: ["poison", "steel"],
  },
};

// Function to calculate weaknesses, resistances, and immunities
const calculateWeaknesses = (types: string[]) => {
  let weaknesses: { [key: string]: number } = {};
  let resistances: { [key: string]: number } = {};
  let immunities: Set<string> = new Set();

  types.forEach((type) => {
    const { strongAgainst, weakAgainst, immuneTo } = typeEffectiveness[type];

    weakAgainst.forEach((weak) => {
      weaknesses[weak] = (weaknesses[weak] || 1) * 2;
    });

    strongAgainst.forEach((resistant) => {
      resistances[resistant] = (resistances[resistant] || 1) * 0.5;
    });

    immuneTo?.forEach((immune) => immunities.add(immune));
  });

  // Filtrar los tipos super efectivos y super resistentes
  let superWeaknesses = Object.keys(weaknesses).filter(
    (type) => weaknesses[type] >= 4
  );
  let superResistances = Object.keys(resistances).filter(
    (type) => resistances[type] <= 0.25
  );

  // Remover cualquier tipo que esté tanto en resistencias como en debilidades
  let finalWeaknesses = Object.keys(weaknesses).filter(
    (type) => weaknesses[type] === 2 && !resistances[type]
  );
  let finalResistances = Object.keys(resistances).filter(
    (type) => resistances[type] === 0.5 && !weaknesses[type]
  );

  return {
    superWeaknesses,
    weaknesses: finalWeaknesses,
    resistances: finalResistances,
    superResistances,
    immunities: Array.from(immunities),
  };
};

const WeaknessTable: React.FC<{ types: string[] }> = ({ types }) => {
  const {
    superWeaknesses,
    weaknesses,
    resistances,
    superResistances,
    immunities,
  } = calculateWeaknesses(types);

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


  const renderTypeBadge = (type: string) => (
    <div className="flex items-center space-x-2 mb-2">
      <div
        className={`w-8 h-8 bg-gray-600 ${getTypeColor(
          type
        )} rounded-full flex items-center justify-center`}
      >
        <img
          src={`/images/type_icons/${type}.svg`}
          alt={`${type} icon`}
          className="w-4 h-4"
        />
      </div>
      <span className="text-xs font-medium capitalize">{type}</span>
    </div>
  );
  
  return (
    <div className="bg-gray-800  rounded-lg mt-1">
      <h2 className="text-2xl font-bold text-left mb-4">Type Effectiveness</h2>
      <div className="space-y-4">
        {superWeaknesses.length > 0 && (
          <div className="flex flex-wrap items-center  space-y-2 sm:space-y-0 sm:space-x-4">
            <h3 className="text-xs font-bold w-24">Super Weak (x4)</h3>
            <div className="flex flex-wrap space-x-4">
              {superWeaknesses.map((type) => (
                <div key={type}>{renderTypeBadge(type)}</div>
              ))}
            </div>
          </div>
        )}
        {weaknesses.length > 0 && (
          <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h3 className="text-xs font-bold w-24">Weak To (x2)</h3>
            <div className="flex flex-wrap space-x-4">
              {weaknesses.map((type) => (
                <div key={type}>{renderTypeBadge(type)}</div>
              ))}
            </div>
          </div>
        )}
        {resistances.length > 0 && (
          <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h3 className="text-xs font-bold w-24">Resist (x0.5)</h3>
            <div className="flex flex-wrap space-x-4">
              {resistances.map((type) => (
                <div key={type}>{renderTypeBadge(type)}</div>
              ))}
            </div>
          </div>
        )}
        {superResistances.length > 0 && (
          <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h3 className="text-xs font-bold w-24">Super Resist (x0.25)</h3>
            <div className="flex flex-wrap space-x-2">
              {superResistances.map((type) => (
                <div key={type}>{renderTypeBadge(type)}</div>
              ))}
            </div>
          </div>
        )}
        {immunities.length > 0 && (
          <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h3 className="text-xs font-bold w-24">Immune To</h3>
            <div className="flex flex-wrap space-x-2">
              {immunities.map((type) => (
                <div key={type}>{renderTypeBadge(type)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaknessTable;
