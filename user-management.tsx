import { Search, Plus, Edit, Trash2, Ban } from "lucide-react"

export function UserManagement() {
  const users = [
    {
      id: 1,
      name: "Rahul Mondal",
      phone: "702924**41",
      email: "rahul@example.com",
      balance: 12,
      totalIncome: 0,
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "9876****32",
      email: "priya@example.com",
      balance: 1250,
      totalIncome: 3400,
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Kumar",
      phone: "8765****21",
      email: "amit@example.com",
      balance: 450,
      totalIncome: 1200,
      status: "Active",
    },
    {
      id: 4,
      name: "Sneha Patel",
      phone: "7654****10",
      email: "sneha@example.com",
      balance: 2800,
      totalIncome: 5600,
      status: "Blocked",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition">
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Status</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Balance</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Income</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">#{user.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{user.balance}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{user.totalIncome}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition">
                      <Ban className="w-4 h-4" />
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
