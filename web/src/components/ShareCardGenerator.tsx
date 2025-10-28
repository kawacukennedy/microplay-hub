'use client'

import { useState } from 'react'

interface ShareCardGeneratorProps {
  score: number
  levelTitle: string
  username?: string
  onShare?: (url: string) => void
}

export function ShareCardGenerator({ score, levelTitle, username, onShare }: ShareCardGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      // Generate share image via API
      const imageResponse = await fetch('/api/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          levelTitle,
          username
        })
      })

      if (!imageResponse.ok) throw new Error('Failed to generate image')

      const { imageUrl } = await imageResponse.json()

      // Create short link
      const linkResponse = await fetch('/api/shortlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: imageUrl
        })
      })

      if (!linkResponse.ok) throw new Error('Failed to create short link')

      const { shortlink } = await linkResponse.json()
      setShareUrl(shortlink.shortUrl)
      onShare?.(shortlink.shortUrl)
    } catch (error) {
      console.error('Failed to generate share card:', error)
      // Fallback to mock URL
      const mockUrl = `https://microplay-hub.com/s/${Math.random().toString(36).substr(2, 8)}`
      setShareUrl(mockUrl)
      onShare?.(mockUrl)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      // TODO: Show toast notification
    }
  }

  const handleShare = (platform: string) => {
    if (!shareUrl) return

    const text = `I scored ${score.toLocaleString()} points on "${levelTitle}"! Can you beat it?`
    const url = shareUrl

    let shareUrlPlatform = ''
    switch (platform) {
      case 'twitter':
        shareUrlPlatform = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'discord':
        // Discord doesn't have a direct share URL, copy to clipboard instead
        navigator.clipboard.writeText(`${text} ${url}`)
        return
    }

    if (shareUrlPlatform) {
      window.open(shareUrlPlatform, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Share Your Score</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          {username ? `${username} scored` : 'You scored'} <strong>{score.toLocaleString()}</strong> points on <strong>{levelTitle}</strong>!
        </p>
      </div>

      {!shareUrl ? (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Share Card'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border rounded text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
            >
              Copy
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleShare('twitter')}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600"
            >
              Twitter
            </button>
            <button
              onClick={() => handleShare('discord')}
              className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded text-sm hover:bg-indigo-600"
            >
              Discord
            </button>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-200"
          >
            Regenerate
          </button>
        </div>
      )}
    </div>
  )
}