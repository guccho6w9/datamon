import React, { useState } from "react";
import '@/app/globals.css';
import PokemonList from "@/components/Pokemon/PokemonList";
import SearchBar from "@/components/Layout/searchbar";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">

        <main>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <SearchBar onSearch={(term) => setSearchTerm(term)} />
          </div>

          <PokemonList searchTerm={searchTerm} />
        </main>
      </div>
    </div>
  );
};

export default Home;
