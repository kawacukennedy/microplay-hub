export default function AdminPage() {
  // TODO: Add authentication check for admin role

  // TODO: Fetch moderation queue from API
  const pendingLevels = [
    {
      id: 'level-1',
      title: 'New Runner Level',
      creator: 'user123',
      submittedAt: new Date('2024-01-25'),
      thumbnail: null
    },
    {
      id: 'level-2',
      title: 'Memory Game Challenge',
      creator: 'gamer456',
      submittedAt: new Date('2024-01-24'),
      thumbnail: null
    }
  ]

  // TODO: Fetch flagged items from API
  const flaggedItems = [
    {
      id: 'level-3',
      title: 'Inappropriate Content',
      creator: 'baduser',
      reason: 'Inappropriate content',
      flaggedAt: new Date('2024-01-23')
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Moderation Queue */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Moderation Queue</h2>
            <div className="space-y-4">
              {pendingLevels.map((level) => (
                <div key={level.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{level.title}</h3>
                    <span className="text-sm text-gray-500">
                      {level.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">By {level.creator}</p>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Reject
                    </button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged Items */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Flagged Items</h2>
            <div className="space-y-4">
              {flaggedItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="text-sm text-gray-500">
                      {item.flaggedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">By {item.creator}</p>
                  <p className="text-sm text-red-600 mb-3">Reason: {item.reason}</p>
                  <div className="flex gap-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                      Review
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-500">User management interface coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}