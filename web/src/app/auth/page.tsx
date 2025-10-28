'use client'

import { useState } from 'react'
import { AuthButton } from '../../components/AuthButton'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h1>

        <div className="space-y-4">
          <AuthButton provider="google" />
          <AuthButton provider="github" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => {
              // TODO: Implement guest play
              console.log('Guest play')
            }}
            className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded hover:bg-gray-200"
          >
            Play as Guest
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-primary hover:underline"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}