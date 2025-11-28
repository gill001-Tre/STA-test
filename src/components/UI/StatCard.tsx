interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm font-medium">{label}</span>
        <div>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-semibold text-gray-900">{value}</div>
    </div>
  )
}

export default StatCard
