import { Calendar, TrendingUp } from "lucide-react"

export function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Reports & Analytics</h1>

      {/* Date Range Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-xl" />
          <span className="text-gray-600">to</span>
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-xl" />
          <button className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600">
            Generate Report
          </button>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Overview</h2>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Chart visualization would appear here</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800">₹2,456,789</p>
          <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 mb-2">New Users</p>
          <p className="text-3xl font-bold text-gray-800">234</p>
          <p className="text-sm text-green-600 mt-2">+8.3% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 mb-2">Active Investments</p>
          <p className="text-3xl font-bold text-gray-800">456</p>
          <p className="text-sm text-green-600 mt-2">+15.7% from last month</p>
        </div>
      </div>
    </div>
  )
}
