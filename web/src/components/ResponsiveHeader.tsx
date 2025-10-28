'use client'

import { useState } from 'react'
import Link from 'next/link'

export function ResponsiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // TODO: Get user from auth context
  const user = null // null means not logged in

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            MicroPlay
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/games" className="text-gray-700 hover:text-primary">
              Browse Games
            </Link>
            <Link href="/editor" className="text-gray-700 hover:text-primary">
              Create Level
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href={`/u/${user.username}`} className="text-gray-700 hover:text-primary">
                  Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-primary">
                    Admin
                  </Link>
                )}
                <button className="text-gray-700 hover:text-primary">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/games" className="text-gray-700 hover:text-primary">
                Browse Games
              </Link>
              <Link href="/editor" className="text-gray-700 hover:text-primary">
                Create Level
              </Link>
              {user ? (
                <>
                  <Link href={`/u/${user.username}`} className="text-gray-700 hover:text-primary">
                    Profile
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="text-gray-700 hover:text-primary">
                      Admin
                    </Link>
                  )}
                  <button className="text-left text-gray-700 hover:text-primary">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 inline-block">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}