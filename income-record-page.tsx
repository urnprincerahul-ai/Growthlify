"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { getIncomeRecords, type IncomeRecord } from "@/lib/income-processor"

interface IncomeRecordPageProps {
  onNavigate: (page: string) => void
}

export function IncomeRecordPage({ onNavigate }: IncomeRecordPageProps) {
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([])

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      const records = getIncomeRecords(userId)
      setIncomeRecords(records)
    }
  }, [])

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
          <h1 className="text-2xl font-bold text-white ml-4">Income Record</h1>
        </div>

        {/* Income List */}
        <div className="space-y-3">
          {incomeRecords.length === 0 ? (
            <div className="bg-white/90 rounded-2xl p-8 text-center">
              <p className="text-gray-500 mb-2">No income records yet</p>
              <p className="text-sm text-gray-400">Invest in a plan to start earning daily income</p>
            </div>
          ) : (
            incomeRecords.map((record) => (
              <div key={record.id} className="bg-white/90 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
                    INCOME
                  </div>
                  <p className="text-sm text-gray-600">{new Date(record.date).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{record.planName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">+₹{record.amount.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
