'use client'

import { useState } from 'react'
import { EditorCanvas } from '../../components/EditorCanvas'

export default function EditorPage() {
  const [selectedGame, setSelectedGame] = useState('runner')
  const [levelTitle, setLevelTitle] = useState('My New Level')

  const games = [
    { id: 'runner', name: 'Runner' },
    { id: 'memory-match', name: 'Memory Match' },
    { id: 'tap-speed', name: 'Tap Speed' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Level Editor</h1>

          <div className="flex gap-4 mb-4">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={levelTitle}
              onChange={(e) => setLevelTitle(e.target.value)}
              placeholder="Level title"
              className="px-3 py-2 border rounded flex-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4">
              <EditorCanvas gameId={selectedGame} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Properties</h3>
              {/* TODO: Properties panel */}
              <p className="text-gray-500">Properties panel coming soon...</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Assets</h3>
              {/* TODO: Asset manager */}
              <p className="text-gray-500">Asset manager coming soon...</p>
            </div>

            <div className="mt-4 space-y-2">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Preview
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Save Draft
              </button>
              <button className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90">
                Publish Level
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}