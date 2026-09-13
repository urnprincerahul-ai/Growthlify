import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

export function InvestmentPlans() {
  const plans = [
    {
      id: 1,
      name: "CNC Plan 1",
      duration: "3 Days",
      price: 450,
      dailyEarnings: 1950,
      totalReturn: 5850,
      category: "Welfare",
      status: "Active",
    },
    {
      id: 2,
      name: "CNC Plan 2",
      duration: "2 Days",
      price: 900,
      dailyEarnings: 3200,
      totalReturn: 6400,
      category: "Welfare",
      status: "Active",
    },
    {
      id: 3,
      name: "CNC Offer",
      duration: "2 Days",
      price: 800,
      dailyEarnings: 2990,
      totalReturn: 5980,
      category: "Normal",
      status: "Active",
    },
    {
      id: 4,
      name: "CNC Plan C",
      duration: "20 Days",
      price: 1900,
      dailyEarnings: 1798,
      totalReturn: 35960,
      category: "Offers",
      status: "Inactive",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Investment Plans</h1>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition">
          <Plus className="w-5 h-5" />
          Add New Plan
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 mb-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold">All</button>
        <button className="px-6 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Normal</button>
        <button className="px-6 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Welfare</button>
        <button className="px-6 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Offers</button>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Daily Earnings</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Return</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{plan.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{plan.duration}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{plan.price}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{plan.dailyEarnings}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{plan.totalReturn}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {plan.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2">
                    {plan.status === "Active" ? (
                      <ToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
