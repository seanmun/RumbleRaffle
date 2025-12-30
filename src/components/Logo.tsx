type LogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-2xl',
    lg: 'text-5xl',
    xl: 'text-6xl'
  }

  const strokeWidths = {
    sm: '0.5px',
    md: '1px',
    lg: '1.5px',
    xl: '2px'
  }

  const shadowBlurs = {
    sm: '1px',
    md: '2px',
    lg: '3px',
    xl: '4px'
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg border-2 border-yellow-500 shadow-lg shadow-purple-500/30 flex items-center justify-center ${className}`}
    >
      <span
        className={`${textSizes[size]} font-[family-name:var(--font-bevan)]`}
        style={{
          WebkitTextStroke: `${strokeWidths[size]} #ca8a04`,
          WebkitTextFillColor: '#FFD700',
          textShadow: `${shadowBlurs[size]} ${shadowBlurs[size]} ${shadowBlurs[size]} rgba(0, 0, 0, 0.8)`
        }}
      >
        RR
      </span>
    </div>
  )
}
