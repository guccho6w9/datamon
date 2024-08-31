import React, { useState } from "react";
import "@/app/globals.css";
import PokemonList from "@/components/Pokemon/PokemonList";
import SearchBar from "@/components/Layout/searchbar";
import Footer from "@/components/Layout/footer";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-4xl flex-grow">
        <main className="flex flex-col flex-grow">
          <div className="bg-white shadow-md rounded-lg mt-6 mb-6">
            <SearchBar onSearch={(term) => setSearchTerm(term)} />
          </div>

          <PokemonList searchTerm={searchTerm} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
