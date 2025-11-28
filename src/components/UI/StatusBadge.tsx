interface StatusBadgeProps {
  status: 'on-track' | 'in-progress' | 'needs-attention'
  className?: string
  variant?: 'horizontal' | 'vertical-ribbon'
}

const StatusBadge = ({ status, className = '', variant = 'horizontal' }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'on-track':
        return {
          label: 'On track',
          bgColor: 'bg-primary',
          textColor: 'text-white'
        }
      case 'in-progress':
        return {
          label: 'In Progress',
          bgColor: 'bg-yellow-500',
          textColor: 'text-white'
        }
      case 'needs-attention':
        return {
          label: 'Needs Attention',
          bgColor: 'bg-red-500',
          textColor: 'text-white'
        }
    }
  }

  const config = getStatusConfig()

  if (variant === 'vertical-ribbon') {
    return (
      <div 
        className={`inline-flex items-center justify-center px-3 py-2 text-[11px] font-medium ${config.bgColor} ${config.textColor} ${className}`}
      >
        <span>{config.label}</span>
      </div>
    )
  }

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge
