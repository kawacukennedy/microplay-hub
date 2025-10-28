'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { LeaderboardEntry, LeaderboardUpdate } from '../../../shared/src'

interface LeaderboardPanelProps {
  levelId: string
}

export function LeaderboardPanel({ levelId }: LeaderboardPanelProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [period, setPeriod] = useState<'alltime' | 'weekly'>('alltime')
  const [loading, setLoading] = useState(true)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io('/ws')
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to leaderboard WebSocket')
      socket.emit('joinLeaderboard', { levelId, period })
    })

    socket.on('leaderboardUpdate', (data: LeaderboardUpdate) => {
      if (data.levelId === levelId && data.period === period) {
        // Update entries based on the delta
        setEntries(prevEntries => {
          // TODO: Apply updates to existing entries
          return prevEntries
        })
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from leaderboard WebSocket')
    })

    return () => {
      socket.emit('leaveLeaderboard', { levelId, period })
      socket.disconnect()
    }
  }, [levelId, period])

  useEffect(() => {
    // Fetch initial leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/scores/leaderboard/${levelId}?period=${period}`)
        const data = await response.json()
        setEntries(data.leaderboard)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
        // Fallback to mock data
        const mockEntries: LeaderboardEntry[] = [
          { userId: '1', username: 'Player1', score: 15420, scoreId: 's1', rank: 1 },
          { userId: '2', username: 'Player2', score: 14850, scoreId: 's2', rank: 2 },
          { userId: '3', username: 'Player3', score: 14200, scoreId: 's3', rank: 3 },
          { userId: '4', username: 'Player4', score: 13900, scoreId: 's4', rank: 4 },
          { userId: '5', username: 'Player5', score: 13500, scoreId: 's5', rank: 5 },
        ]
        setEntries(mockEntries)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [levelId, period])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Leaderboard</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'alltime' | 'weekly')}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="alltime">All Time</option>
          <option value="weekly">This Week</option>
        </select>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.scoreId}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                entry.rank === 1 ? 'bg-yellow-400 text-black' :
                entry.rank === 2 ? 'bg-gray-400 text-white' :
                entry.rank === 3 ? 'bg-amber-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {entry.rank}
              </span>
              <span className="font-medium">{entry.username}</span>
            </div>
            <span className="font-mono text-sm">{entry.score.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <p className="text-gray-500 text-center py-4">No scores yet. Be the first!</p>
      )}
    </div>
  )
}