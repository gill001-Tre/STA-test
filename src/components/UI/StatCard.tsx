interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  iconBgColor?: string
}

const StatCard = ({ icon, label, value, iconBgColor = 'bg-orange-100' }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm font-medium">{label}</span>
        <div className={`${iconBgColor} p-2 rounded-lg`}>
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

export default StatCard
