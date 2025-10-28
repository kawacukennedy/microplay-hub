'use client'

import { useState, useCallback } from 'react'
import { EditorCanvas } from '../../components/EditorCanvas'

export default function EditorPage() {
  const [selectedGame, setSelectedGame] = useState('runner')
  const [levelTitle, setLevelTitle] = useState('My New Level')
  const [levelDescription, setLevelDescription] = useState('')
  const [levelTags, setLevelTags] = useState<string[]>([])
  const [levelData, setLevelData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'published'>('idle')

  const games = [
    { id: 'runner', name: 'Runner' },
    { id: 'memory-match', name: 'Memory Match' },
    { id: 'tap-speed', name: 'Tap Speed' }
  ]

  const handleLevelChange = useCallback((data: any) => {
    setLevelData(data)
  }, [])

  const handleSaveDraft = async () => {
    if (!levelData) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: selectedGame,
          title: levelTitle,
          description: levelDescription,
          data: levelData,
          assets: [], // TODO: Add asset references
          tags: levelTags,
          publish: false
        })
      })

      if (response.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Failed to save draft:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!levelData) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: selectedGame,
          title: levelTitle,
          description: levelDescription,
          data: levelData,
          assets: [], // TODO: Add asset references
          tags: levelTags,
          publish: true
        })
      })

      if (response.ok) {
        setSaveStatus('published')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Failed to publish level:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    // TODO: Open preview in new window or modal
    console.log('Preview level:', levelData)
  }

  const addTag = (tag: string) => {
    if (tag && !levelTags.includes(tag)) {
      setLevelTags([...levelTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setLevelTags(levelTags.filter(t => t !== tag))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Level Editor</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Game</label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Level Title</label>
              <input
                type="text"
                value={levelTitle}
                onChange={(e) => setLevelTitle(e.target.value)}
                placeholder="Enter level title"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={levelDescription}
              onChange={(e) => setLevelDescription(e.target.value)}
              placeholder="Describe your level..."
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {levelTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTag((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
              className="px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4">
              <EditorCanvas
                gameId={selectedGame}
                onLevelChange={handleLevelChange}
              />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Level Stats</h3>
              <div className="space-y-2 text-sm">
                <div>Objects: {levelData?.objects?.length || 0}</div>
                <div>Game: {games.find(g => g.id === selectedGame)?.name}</div>
                <div>Status: {saveStatus === 'saved' ? 'Draft Saved' : saveStatus === 'published' ? 'Published' : 'Unsaved'}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handlePreview}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  disabled={!levelData}
                >
                  Preview Level
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving || !levelData}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isSaving || !levelData}
                  className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSaving ? 'Publishing...' : 'Publish Level'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <div className="text-sm space-y-2 text-gray-600">
                <p><strong>Select:</strong> Click objects to select them</p>
                <p><strong>Add:</strong> Click empty space to add objects</p>
                <p><strong>Erase:</strong> Click objects to remove them</p>
                <p><strong>Zoom:</strong> Use mouse wheel to zoom in/out</p>
                <p><strong>Grid:</strong> Toggle grid for precise placement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}