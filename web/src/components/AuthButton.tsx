'use client'

interface AuthButtonProps {
  provider: 'google' | 'github'
  onClick?: () => void
}

export function AuthButton({ provider, onClick }: AuthButtonProps) {
  const handleClick = () => {
    // TODO: Implement OAuth flow
    console.log(`Sign in with ${provider}`)
    onClick?.()
  }

  const getProviderInfo = () => {
    switch (provider) {
      case 'google':
        return {
          name: 'Google',
          icon: '🌐',
          bgColor: 'bg-white hover:bg-gray-50',
          textColor: 'text-gray-900',
          border: 'border border-gray-300'
        }
      case 'github':
        return {
          name: 'GitHub',
          icon: '🐙',
          bgColor: 'bg-gray-900 hover:bg-gray-800',
          textColor: 'text-white',
          border: ''
        }
    }
  }

  const { name, icon, bgColor, textColor, border } = getProviderInfo()

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg font-medium transition-colors ${bgColor} ${textColor} ${border}`}
    >
      <span className="text-lg">{icon}</span>
      <span>Continue with {name}</span>
    </button>
  )
}