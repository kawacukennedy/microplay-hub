import * as PIXI from 'pixi.js'
import { GameConfig, GameResult } from '../../../shared/src'

interface Target {
  sprite: PIXI.Sprite
  x: number
  y: number
  createdAt: number
}

export class TapSpeedGame {
  private app: PIXI.Application
  private config: GameConfig
  private targets: Target[] = []
  private score = 0
  private isRunning = false
  private startTime = 0
  private lastTargetTime = 0
  private onEnd?: (result: GameResult) => void

  constructor(app: PIXI.Application, config: GameConfig) {
    this.app = app
    this.config = config
  }

  init() {
    // Set up click handler on the entire canvas
    this.app.view.addEventListener('click', this.handleCanvasClick.bind(this))
  }

  private handleCanvasClick(event: MouseEvent) {
    if (!this.isRunning) return

    const rect = (this.app.view as HTMLCanvasElement).getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is on a target
    const clickedTargetIndex = this.targets.findIndex(target => {
      const dx = x - target.x
      const dy = y - target.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance <= 30 // Target radius
    })

    if (clickedTargetIndex !== -1) {
      // Hit a target
      this.score++
      const target = this.targets[clickedTargetIndex]
      this.app.stage.removeChild(target.sprite)
      this.targets.splice(clickedTargetIndex, 1)
    }
  }

  private spawnTarget() {
    const target = PIXI.Sprite.from('https://via.placeholder.com/60x60/ff0000')
    target.width = 60
    target.height = 60
    target.anchor.set(0.5)

    // Random position
    const margin = 50
    const x = margin + Math.random() * (this.app.screen.width - 2 * margin)
    const y = margin + Math.random() * (this.app.screen.height - 2 * margin)

    target.x = x
    target.y = y

    this.app.stage.addChild(target)
    this.targets.push({
      sprite: target,
      x,
      y,
      createdAt: Date.now()
    })
  }

  private updateTargets() {
    const currentTime = Date.now()

    // Remove old targets
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const target = this.targets[i]
      if (currentTime - target.createdAt > 2000) { // 2 seconds
        this.app.stage.removeChild(target.sprite)
        this.targets.splice(i, 1)
      }
    }

    // Spawn new targets
    if (currentTime - this.lastTargetTime > 500 + Math.random() * 1000) { // 0.5-1.5 seconds
      this.spawnTarget()
      this.lastTargetTime = currentTime
    }
  }

  start(onEnd?: (result: GameResult) => void) {
    this.onEnd = onEnd
    this.isRunning = true
    this.startTime = Date.now()
    this.lastTargetTime = Date.now()

    // Start game loop
    this.app.ticker.add(this.update.bind(this))
  }

  private update() {
    if (!this.isRunning) return

    this.updateTargets()

    // Check time limit
    const elapsed = (Date.now() - this.startTime) / 1000
    if (elapsed >= this.config.timeLimit) {
      this.end()
    }
  }

  end() {
    this.isRunning = false
    this.app.ticker.remove(this.update.bind(this))

    // Clean up targets
    this.targets.forEach(target => {
      this.app.stage.removeChild(target.sprite)
    })
    this.targets = []

    const result: GameResult = {
      score: this.score,
      duration: (Date.now() - this.startTime) / 1000,
    }

    this.onEnd?.(result)
  }

  serialize() {
    return {
      config: this.config,
    }
  }
}