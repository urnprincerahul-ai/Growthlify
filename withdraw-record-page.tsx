"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

interface WithdrawRecordPageProps {
  onNavigate: (page: string) => void
}

export function WithdrawRecordPage({ onNavigate }: WithdrawRecordPageProps) {
  const [withdrawRecords, setWithdrawRecords] = useState<any[]>([])

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const userWithdrawals = JSON.parse(localStorage.getItem(`userWithdrawals_${userId}`) || "[]")

    // Sort by date descending (newest first)
    const sortedWithdrawals = userWithdrawals.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    setWithdrawRecords(sortedWithdrawals)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => onNavigate("profile")}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">Withdraw Record</h1>
        </div>

        {/* Withdraw List */}
        {withdrawRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">No withdrawal records found</p>
            <button
              onClick={() => onNavigate("home")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Make a Withdrawal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">₹{Number.parseFloat(record.amount).toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(record.date)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Bank Name</span>
                    <span className="font-semibold text-gray-800">{record.bankName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-semibold text-gray-800">{record.accountNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
