interface ProgressBarProps {
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
  showPercentage?: boolean
  height?: string
}

const ProgressBar = ({ 
  progress, 
  status, 
  showPercentage = true,
  height = 'h-2' 
}: ProgressBarProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'on-track':
        return 'bg-primary'
      case 'in-progress':
        return 'bg-yellow-500'
      case 'needs-attention':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div className="w-full">
      <div className={`relative ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div 
          className={`absolute top-0 left-0 h-full ${getStatusColor()} transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-gray-600 mt-1 inline-block">
          {progress}%
        </span>
      )}
    </div>
  )
}

export default ProgressBar
