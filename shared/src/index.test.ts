import { describe, it, expect } from 'vitest'
import { formatScore, formatDuration, validateUsername, createHMAC } from './index'

describe('Utility functions', () => {
  describe('formatScore', () => {
    it('formats numbers with commas', () => {
      expect(formatScore(1234)).toBe('1,234')
      expect(formatScore(1234567)).toBe('1,234,567')
    })
  })

  describe('formatDuration', () => {
    it('formats seconds with one decimal place', () => {
      expect(formatDuration(12.345)).toBe('12.3s')
      expect(formatDuration(65.7)).toBe('65.7s')
    })
  })

  describe('validateUsername', () => {
    it('accepts valid usernames', () => {
      expect(validateUsername('testuser')).toBe(true)
      expect(validateUsername('user123')).toBe(true)
      expect(validateUsername('test_user')).toBe(true)
    })

    it('rejects invalid usernames', () => {
      expect(validateUsername('us')).toBe(false) // too short
      expect(validateUsername('user@domain')).toBe(false) // invalid chars
      expect(validateUsername('a'.repeat(30))).toBe(false) // too long
    })
  })

  describe('createHMAC', () => {
    it('creates a consistent hash', () => {
      const message = 'test message'
      const secret = 'test secret'
      const hash1 = createHMAC(message, secret)
      const hash2 = createHMAC(message, secret)
      expect(hash1).toBe(hash2)
    })

    it('creates different hashes for different inputs', () => {
      const hash1 = createHMAC('message1', 'secret')
      const hash2 = createHMAC('message2', 'secret')
      expect(hash1).not.toBe(hash2)
    })
  })
})