"use client"

import { useState, useEffect } from "react"
import { Check, X, Search, RefreshCw } from "lucide-react"
import { getRechargeRequests, approveRecharge, rejectRecharge } from "@/lib/firebase-admin"

interface RechargeRequest {
  id: string
  amount: number
  utrNumber: string
  channel: string
  status: "pending" | "approved" | "rejected"
  createdAt: any
  userId: string
  userName: string
  userPhone: string
}

export function RechargeApprovalAdmin() {
  const [requests, setRequests] = useState<RechargeRequest[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const loadRequests = async () => {
    setIsLoading(true)
    try {
      const data = await getRechargeRequests()
      setRequests(data as RechargeRequest[])
    } catch (error) {
      console.error("[v0] Error loading recharge requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
    // Refresh every 30 seconds
    const interval = setInterval(loadRequests, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleApprove = async (requestId: string, userId: string, amount: number) => {
    if (!confirm(`Approve recharge of ₹${amount}?`)) return

    try {
      await approveRecharge(requestId, userId, amount)
      alert("Recharge approved! User balance has been updated.")
      await loadRequests()
    } catch (error) {
      console.error("[v0] Error approving recharge:", error)
      alert("Failed to approve recharge. Please try again.")
    }
  }

  const handleReject = async (requestId: string) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    try {
      await rejectRecharge(requestId, reason)
      alert(`Recharge rejected. Reason: ${reason}`)
      await loadRequests()
    } catch (error) {
      console.error("[v0] Error rejecting recharge:", error)
      alert("Failed to reject recharge. Please try again.")
    }
  }

  const filteredRequests = requests
    .filter((req) => (filter === "all" ? true : req.status === filter))
    .filter((req) =>
      searchTerm
        ? req.utrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.userPhone.includes(searchTerm)
        : true,
    )

  const pendingCount = requests.filter((r) => r.status === "pending").length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Recharge Approvals</h1>
        <p className="text-gray-600">Review and approve user recharge requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 shadow-sm border border-orange-100">
          <p className="text-sm text-orange-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100">
          <p className="text-sm text-green-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">{requests.filter((r) => r.status === "approved").length}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100">
          <p className="text-sm text-red-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{requests.filter((r) => r.status === "rejected").length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by UTR, User ID, Name, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "pending" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "approved" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "rejected" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={loadRequests}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UTR Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading recharge requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No recharge requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                      <div className="text-sm text-gray-500">{request.userPhone}</div>
                      <div className="text-xs text-gray-400">ID: {request.userId.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{request.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 bg-gray-50 rounded">
                      {request.utrNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {request.channel.replace("-", " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.createdAt?.toDate ? new Date(request.createdAt.toDate()).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request.id, request.userId, request.amount)}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
