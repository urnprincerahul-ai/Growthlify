import { Users, TrendingUp, DollarSign, Clock } from "lucide-react"

export function Dashboard() {
  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, color: "bg-blue-500" },
    { label: "Active Investments", value: "456", icon: TrendingUp, color: "bg-green-500" },
    { label: "Total Revenue", value: "₹2.5M", icon: DollarSign, color: "bg-purple-500" },
    { label: "Pending Withdrawals", value: "23", icon: Clock, color: "bg-orange-500" },
  ]

  const recentActivities = [
    { user: "Rahul Mondal", action: "Invested in CNC Plan 1", amount: "₹450", time: "2 mins ago" },
    { user: "Priya Sharma", action: "Withdrawal request", amount: "₹1,200", time: "15 mins ago" },
    { user: "Amit Kumar", action: "Recharged account", amount: "₹800", time: "1 hour ago" },
    { user: "Sneha Patel", action: "Invested in CNC Plan 3", amount: "₹2,400", time: "2 hours ago" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-semibold text-gray-800">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{activity.amount}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
