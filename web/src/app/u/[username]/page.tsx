import Link from 'next/link'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // TODO: Fetch user data from API
  const user = {
    username: params.username,
    avatarUrl: null,
    role: 'CREATOR',
    createdAt: new Date('2024-01-01'),
    stats: {
      levelsCreated: 5,
      totalPlays: 1234,
      bestScore: 98765
    }
  }

  // TODO: Fetch user's levels from API
  const levels = [
    {
      id: 'level-1',
      title: 'My First Level',
      gameId: 'runner',
      playsCount: 234,
      likesCount: 12,
      publishedAt: new Date('2024-01-15')
    },
    {
      id: 'level-2',
      title: 'Advanced Runner',
      gameId: 'runner',
      playsCount: 456,
      likesCount: 34,
      publishedAt: new Date('2024-01-20')
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-2xl font-bold text-gray-500">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-gray-600 capitalize">{user.role.toLowerCase()}</p>
              <p className="text-sm text-gray-500">
                Joined {user.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.stats.levelsCreated}</div>
              <div className="text-sm text-gray-600">Levels Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.stats.totalPlays}</div>
              <div className="text-sm text-gray-600">Total Plays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.stats.bestScore.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
          </div>
        </div>

        {/* Created Levels */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Created Levels</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => (
              <div key={level.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-32 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Level Thumbnail</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{level.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>{level.playsCount} plays</span>
                    <span>{level.likesCount} likes</span>
                  </div>
                  <Link
                    href={`/levels/${level.id}`}
                    className="w-full bg-primary text-white py-2 px-4 rounded text-center block hover:bg-primary/90"
                  >
                    Play
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}