import * as PIXI from 'pixi.js'
import { GameConfig, GameResult } from '../../../shared/src'

export class MemoryMatchGame {
  private app: PIXI.Application
  private config: GameConfig
  private cards: PIXI.Sprite[] = []
  private cardValues: number[] = []
  private flippedCards: number[] = []
  private matchedPairs = 0
  private totalPairs = 8
  private isRunning = false
  private startTime = 0
  private onEnd?: (result: GameResult) => void

  constructor(app: PIXI.Application, config: GameConfig) {
    this.app = app
    this.config = config
  }

  init() {
    this.generateCardLayout()
    this.createCards()
    this.shuffleCards()
  }

  private generateCardLayout() {
    // Create pairs of cards (4x4 grid = 16 cards, 8 pairs)
    this.cardValues = []
    for (let i = 1; i <= this.totalPairs; i++) {
      this.cardValues.push(i, i)
    }
  }

  private createCards() {
    const cardWidth = 80
    const cardHeight = 80
    const padding = 10
    const startX = (this.app.screen.width - (4 * cardWidth + 3 * padding)) / 2
    const startY = (this.app.screen.height - (4 * cardHeight + 3 * padding)) / 2

    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4)
      const col = i % 4

      const card = PIXI.Sprite.from('https://via.placeholder.com/80x80/cccccc')
      card.x = startX + col * (cardWidth + padding)
      card.y = startY + row * (cardHeight + padding)
      card.width = cardWidth
      card.height = cardHeight
      card.interactive = true
      card.buttonMode = true
      card.on('pointerdown', () => this.flipCard(i))

      this.cards.push(card)
      this.app.stage.addChild(card)
    }
  }

  private shuffleCards() {
    // Fisher-Yates shuffle
    for (let i = this.cardValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cardValues[i], this.cardValues[j]] = [this.cardValues[j], this.cardValues[i]]
    }
  }

  private flipCard(index: number) {
    if (!this.isRunning || this.flippedCards.length >= 2 || this.flippedCards.includes(index)) {
      return
    }

    this.flippedCards.push(index)
    const card = this.cards[index]

    // TODO: Show card value instead of changing color
    card.tint = 0xff0000

    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 1000)
    }
  }

  private checkMatch() {
    const [index1, index2] = this.flippedCards
    const value1 = this.cardValues[index1]
    const value2 = this.cardValues[index2]

    if (value1 === value2) {
      // Match found
      this.matchedPairs++
      this.cards[index1].alpha = 0.5
      this.cards[index2].alpha = 0.5
      this.cards[index1].interactive = false
      this.cards[index2].interactive = false

      if (this.matchedPairs === this.totalPairs) {
        this.end()
      }
    } else {
      // No match
      this.cards[index1].tint = 0xffffff
      this.cards[index2].tint = 0xffffff
    }

    this.flippedCards = []
  }

  start(onEnd?: (result: GameResult) => void) {
    this.onEnd = onEnd
    this.isRunning = true
    this.startTime = Date.now()
  }

  end() {
    this.isRunning = false
    const duration = (Date.now() - this.startTime) / 1000
    const score = Math.max(0, Math.floor((this.totalPairs * 1000) / duration))

    const result: GameResult = {
      score,
      duration,
    }

    this.onEnd?.(result)
  }

  serialize() {
    return {
      config: this.config,
      cardValues: this.cardValues,
    }
  }
}