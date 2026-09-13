import { Download } from "lucide-react"

export function Transactions() {
  const transactions = [
    {
      id: "TXN001",
      user: "Rahul Mondal",
      type: "Recharge",
      amount: 800,
      status: "Completed",
      date: "2025-10-02 13:45",
    },
    {
      id: "TXN002",
      user: "Priya Sharma",
      type: "Withdrawal",
      amount: 1200,
      status: "Pending",
      date: "2025-10-02 13:30",
    },
    {
      id: "TXN003",
      user: "Amit Kumar",
      type: "Investment",
      amount: 450,
      status: "Completed",
      date: "2025-10-02 12:15",
    },
    { id: "TXN004", user: "Sneha Patel", type: "Recharge", amount: 2400, status: "Failed", date: "2025-10-02 11:20" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-600 transition">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold">All</button>
        <button className="px-6 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
          Recharges
        </button>
        <button className="px-6 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
          Withdrawals
        </button>
        <button className="px-6 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
          Investments
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{txn.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{txn.user}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{txn.type}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{txn.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      txn.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : txn.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{txn.date}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700 text-sm font-semibold">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
