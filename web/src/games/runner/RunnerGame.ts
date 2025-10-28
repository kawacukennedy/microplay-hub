import * as PIXI from 'pixi.js'

export interface GameConfig {
  seed: number
  difficulty: number
  timeLimit: number
}

export interface GameResult {
  score: number
  duration: number
  replayDataHash?: string
  replayData?: any
}

export class RunnerGame {
  private app: PIXI.Application
  private player: PIXI.Sprite
  private obstacles: PIXI.Sprite[] = []
  private score = 0
  private isRunning = false
  private startTime = 0
  private config: GameConfig
  private onEnd?: (result: GameResult) => void

  constructor(app: PIXI.Application, config: GameConfig) {
    this.app = app
    this.config = config
  }

  init() {
    // Create player
    this.player = PIXI.Sprite.from('https://via.placeholder.com/32x32')
    this.player.x = 100
    this.player.y = 300
    this.app.stage.addChild(this.player)

    // Set up input
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  start(onEnd?: (result: GameResult) => void) {
    this.onEnd = onEnd
    this.isRunning = true
    this.startTime = Date.now()
    this.app.ticker.add(this.update.bind(this))
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isRunning) return

    switch (event.code) {
      case 'ArrowUp':
      case 'Space':
        // Jump
        this.player.y -= 50
        break
      case 'ArrowDown':
        // Duck
        this.player.y += 20
        break
    }
  }

  private update() {
    if (!this.isRunning) return

    // Move player down (gravity)
    this.player.y += 2

    // Generate obstacles based on seed
    // TODO: Implement deterministic obstacle generation

    // Check collisions
    // TODO: Implement collision detection

    // Check time limit
    const elapsed = (Date.now() - this.startTime) / 1000
    if (elapsed >= this.config.timeLimit) {
      this.end()
    }
  }

  end() {
    this.isRunning = false
    this.app.ticker.remove(this.update.bind(this))

    const result: GameResult = {
      score: this.score,
      duration: (Date.now() - this.startTime) / 1000,
    }

    this.onEnd?.(result)
  }

  serialize() {
    return {
      config: this.config,
      // TODO: Serialize level data
    }
  }
}