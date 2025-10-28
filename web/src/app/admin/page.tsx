'use client'

import { useState, useEffect } from 'react'

interface PendingLevel {
  id: string
  title: string
  creator: {
    id: string
    username: string
  }
  data: any
  assets: any[]
  tags: string[]
  createdAt: Date
  thumbnailUrl?: string
}

interface FlaggedItem {
  id: string
  type: string
  itemId: string
  reason: string
  reportedBy: string
  flaggedAt: Date
  status: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'moderation' | 'flagged' | 'users'>('moderation')
  const [pendingLevels, setPendingLevels] = useState<PendingLevel[]>([])
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [levelsRes, flaggedRes] = await Promise.all([
        fetch('/api/moderation/levels'),
        fetch('/api/moderation/flagged')
      ])

      const levelsData = await levelsRes.json()
      const flaggedData = await flaggedRes.json()

      setPendingLevels(levelsData.levels)
      setFlaggedItems(flaggedData.items)
    } catch (error) {
      console.error('Failed to fetch moderation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveLevel = async (levelId: string) => {
    try {
      await fetch(`/api/moderation/levels/${levelId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moderatorId: 'admin-1', // TODO: Get from auth
          notes: 'Approved via admin panel'
        })
      })

      // Remove from pending list
      setPendingLevels(prev => prev.filter(level => level.id !== levelId))
    } catch (error) {
      console.error('Failed to approve level:', error)
    }
  }

  const handleRejectLevel = async (levelId: string, reason: string) => {
    try {
      await fetch(`/api/moderation/levels/${levelId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moderatorId: 'admin-1', // TODO: Get from auth
          reason,
          notes: 'Rejected via admin panel'
        })
      })

      // Remove from pending list
      setPendingLevels(prev => prev.filter(level => level.id !== levelId))
    } catch (error) {
      console.error('Failed to reject level:', error)
    }
  }

  const handleResolveFlagged = async (flagId: string, action: 'dismiss' | 'remove') => {
    try {
      await fetch(`/api/moderation/flagged/${flagId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          moderatorId: 'admin-1', // TODO: Get from auth
          notes: `${action} via admin panel`
        })
      })

      // Remove from flagged list
      setFlaggedItems(prev => prev.filter(item => item.id !== flagId))
    } catch (error) {
      console.error('Failed to resolve flagged item:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded ${
              activeTab === 'moderation'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Moderation Queue ({pendingLevels.length})
          </button>
          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-4 py-2 rounded ${
              activeTab === 'flagged'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Flagged Items ({flaggedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded ${
              activeTab === 'users'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            User Management
          </button>
        </div>

        {/* Moderation Queue */}
        {activeTab === 'moderation' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Pending Level Approvals</h2>
            {pendingLevels.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No levels pending moderation</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingLevels.map((level) => (
                  <div key={level.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{level.title}</h3>
                        <p className="text-gray-600">By {level.creator.username}</p>
                        <p className="text-sm text-gray-500">
                          Submitted {level.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {level.tags.map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Level Preview</h4>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <span className="text-gray-500">Level preview coming soon</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Assets</h4>
                        <div className="text-sm text-gray-600">
                          {level.assets.length} assets uploaded
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveLevel(level.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:')
                          if (reason) handleRejectLevel(level.id, reason)
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Preview Level
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Flagged Items */}
        {activeTab === 'flagged' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Flagged Items</h2>
            {flaggedItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No flagged items</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flaggedItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.type} - {item.itemId}</h3>
                        <p className="text-sm text-gray-600">Reported by {item.reportedBy}</p>
                        <p className="text-sm text-red-600">Reason: {item.reason}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {item.flaggedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleResolveFlagged(item.id, 'dismiss')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveFlagged(item.id, 'remove')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-500">User management interface coming soon...</p>
              <div className="mt-4 space-y-2">
                <p>• View all users</p>
                <p>• Manage user roles</p>
                <p>• Ban/unban users</p>
                <p>• View user activity</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}