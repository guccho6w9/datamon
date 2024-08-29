import React from "react";
import PokemonList from "@/components/Pokemon/PokemonList";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Pokémon List</h1>
        <PokemonList />
      </div>
    </div>
  );
}
