interface StatusBadgeProps {
  status: 'on-track' | 'in-progress' | 'needs-attention'
  className?: string
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
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

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge
