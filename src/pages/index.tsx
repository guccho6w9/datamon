import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pokémon Team Builder</h1>
          <p className="text-lg text-gray-700">
            Create, search, and simulate Pokémon teams using Pokémon Showdown APIs.
          </p>
        </header>

        <main>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search for Replays</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="username">
                  Search by Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full p-3 border rounded-md"
                  placeholder="Enter a username..."
                />
              </div>
              <div className="flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Team</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200">
              Create Team
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Simulate a Battle</h2>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
              Simulate
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
