interface ProgressCircleProps {
  total: number
  completed: number
  size?: number
  strokeWidth?: number
}

const ProgressCircle = ({ 
  total, 
  completed, 
  size = 24, 
  strokeWidth = 3 
}: ProgressCircleProps) => {
  const progress = total > 0 ? (completed / total) * 100 : 0
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const getStrokeColor = () => {
    if (progress >= 60) return '#FF6600' // on-track (primary orange)
    if (progress >= 30) return '#EAB308' // in-progress (yellow)
    return '#DC2626' // needs-attention (red)
  }

  const isCompleted = completed === total && total > 0

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {/* Checkmark for completed */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17L4 12"
              stroke={getStrokeColor()}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default ProgressCircle

