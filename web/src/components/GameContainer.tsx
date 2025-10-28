'use client'

import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { RunnerGame, type GameConfig, type GameResult } from '../games/runner/RunnerGame'
import { MemoryMatchGame } from '../games/memory-match/MemoryMatchGame'
import { TapSpeedGame } from '../games/tap-speed/TapSpeedGame'

interface GameContainerProps {
  gameId: string
  levelId: string
  onScore?: (score: number) => void
}

export function GameContainer({ gameId, levelId, onScore }: GameContainerProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Pixi.js app
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x0f172a,
    })

    canvasRef.current.appendChild(app.view as any)

    // Load game engine based on gameId
    const config: GameConfig = {
      seed: Math.random(),
      difficulty: 1,
      timeLimit: 60,
    }

    let game: RunnerGame | MemoryMatchGame | TapSpeedGame

    switch (gameId) {
      case 'runner':
        game = new RunnerGame(app, config)
        break
      case 'memory-match':
        game = new MemoryMatchGame(app, config)
        break
      case 'tap-speed':
        game = new TapSpeedGame(app, config)
        break
      default:
        console.error(`Unknown game: ${gameId}`)
        return
    }

    game.init()
    game.start((result: GameResult) => {
      onScore?.(result.score)
    })

    return () => {
      app.destroy()
    }
  }, [gameId, levelId, onScore])

  return (
    <div ref={canvasRef} className="w-full h-full" />
  )
}