"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"

export function WithdrawalRequests() {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]")
    // Filter only pending requests
    const pendingRequests = withdrawalRequests.filter((req: any) => req.status === "pending")
    setRequests(pendingRequests)
  }

  const handleApprove = (requestId: string) => {
    const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]")
    const requestIndex = withdrawalRequests.findIndex((req: any) => req.id === requestId)

    if (requestIndex === -1) return

    const request = withdrawalRequests[requestIndex]

    // Update request status
    withdrawalRequests[requestIndex].status = "approved"
    withdrawalRequests[requestIndex].approvedDate = new Date().toISOString()
    localStorage.setItem("withdrawalRequests", JSON.stringify(withdrawalRequests))

    // Update user's withdrawal history
    const userId = request.userId
    const userWithdrawals = JSON.parse(localStorage.getItem(`userWithdrawals_${userId}`) || "[]")
    const userWithdrawalIndex = userWithdrawals.findIndex(
      (w: any) => w.date === request.requestDate && w.amount === request.amount,
    )

    if (userWithdrawalIndex !== -1) {
      userWithdrawals[userWithdrawalIndex].status = "completed"
      localStorage.setItem(`userWithdrawals_${userId}`, JSON.stringify(userWithdrawals))
    }

    // Deduct from user balance and update totalWithdraw
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
    const currentTotalWithdraw = Number.parseFloat(localStorage.getItem("totalWithdraw") || "0")

    localStorage.setItem("userBalance", (currentBalance - request.amount).toString())
    localStorage.setItem("totalWithdraw", (currentTotalWithdraw + request.amount).toString())

    alert(`Withdrawal request approved! ₹${request.amount} will be sent to ${request.userName}`)
    loadRequests()
  }

  const handleReject = (requestId: string) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]")
    const requestIndex = withdrawalRequests.findIndex((req: any) => req.id === requestId)

    if (requestIndex === -1) return

    const request = withdrawalRequests[requestIndex]

    // Update request status
    withdrawalRequests[requestIndex].status = "rejected"
    withdrawalRequests[requestIndex].rejectionReason = reason
    withdrawalRequests[requestIndex].rejectedDate = new Date().toISOString()
    localStorage.setItem("withdrawalRequests", JSON.stringify(withdrawalRequests))

    // Update user's withdrawal history
    const userId = request.userId
    const userWithdrawals = JSON.parse(localStorage.getItem(`userWithdrawals_${userId}`) || "[]")
    const userWithdrawalIndex = userWithdrawals.findIndex(
      (w: any) => w.date === request.requestDate && w.amount === request.amount,
    )

    if (userWithdrawalIndex !== -1) {
      userWithdrawals[userWithdrawalIndex].status = "rejected"
      localStorage.setItem(`userWithdrawals_${userId}`, JSON.stringify(userWithdrawals))
    }

    alert(`Withdrawal request rejected. Reason: ${reason}`)
    loadRequests()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Withdrawal Requests</h1>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No pending withdrawal requests</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Request ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bank Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Request Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">WD{req.id.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{req.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.userPhone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{req.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="font-medium">{req.bankDetails.bankName}</div>
                    <div className="text-xs text-gray-500">{req.bankDetails.accountName}</div>
                    <div className="text-xs text-gray-500">
                      {req.bankDetails.accountNumber} • {req.bankDetails.ifscCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(req.requestDate)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
