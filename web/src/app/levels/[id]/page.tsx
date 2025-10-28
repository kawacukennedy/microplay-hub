import { GameContainer } from '../../../components/GameContainer'
import { LeaderboardPanel } from '../../../components/LeaderboardPanel'

interface PlayPageProps {
  params: {
    id: string
  }
}

export default function PlayPage({ params }: PlayPageProps) {
  // TODO: Fetch level data from API
  const level = {
    id: params.id,
    title: 'Demo Runner Level',
    gameId: 'runner',
    creator: 'demo_creator'
  }

  const handleScore = (score: number) => {
    console.log('Score achieved:', score)
    // TODO: Submit score to API
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{level.title}</h1>
          <p className="text-gray-600">Created by {level.creator}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <GameContainer
                gameId={level.gameId}
                levelId={level.id}
                onScore={handleScore}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <LeaderboardPanel levelId={level.id} />
          </div>
        </div>
      </div>
    </div>
  )
}