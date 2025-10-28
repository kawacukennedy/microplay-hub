import Link from 'next/link'

export default function GamesPage() {
  // TODO: Fetch games from API
  const games = [
    {
      id: 'runner',
      title: 'Runner',
      description: 'Run, jump, and avoid obstacles!',
      thumbnail: '/game-runner.jpg',
      levelsCount: 42
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Test your memory with card matching',
      thumbnail: '/game-memory.jpg',
      levelsCount: 15
    },
    {
      id: 'tap-speed',
      title: 'Tap Speed',
      description: 'How fast can you tap?',
      thumbnail: '/game-tap.jpg',
      levelsCount: 8
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Games</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Game Thumbnail</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{game.levelsCount} levels</span>
                  <Link
                    href={`/games/${game.id}`}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}