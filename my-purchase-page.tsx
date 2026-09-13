"use client"

import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { processInvestmentIncome } from "@/lib/income-processor"

interface MyPurchasePageProps {
  onNavigate: (page: string) => void
}

export function MyPurchasePage({ onNavigate }: MyPurchasePageProps) {
  const [purchases, setPurchases] = useState<any[]>([])

  useEffect(() => {
    const result = processInvestmentIncome()
    if (result.totalNewIncome > 0) {
      console.log(`[v0] Credited ₹${result.totalNewIncome.toFixed(2)} in daily income`)
    }

    loadPurchases()
  }, [])

  const loadPurchases = () => {
    const investments = JSON.parse(localStorage.getItem("userInvestments") || "[]")
    setPurchases(investments)
  }

  const getProgress = (purchase: any) => {
    const purchaseDate = new Date(purchase.purchaseDate)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24))
    const completedDays = Math.min(daysPassed, purchase.duration)
    const percentage = Math.round((completedDays / purchase.duration) * 100)

    return { completedDays, percentage }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date
      .toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-")
      .replace(",", "")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">My Purchase</h1>
        </div>

        {/* Purchase List */}
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center">
              <p className="text-gray-600">No active investments yet</p>
              <button
                onClick={() => onNavigate("home")}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Start Investing
              </button>
            </div>
          ) : (
            purchases.map((purchase) => {
              const { completedDays, percentage } = getProgress(purchase)

              return (
                <div key={purchase.id} className="bg-white rounded-3xl p-5 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{purchase.planName}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        purchase.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {purchase.status === "active" ? "Active" : "Completed"}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Date</span>
                      <span className="font-semibold text-gray-800">{formatDate(purchase.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invested Amount</span>
                      <span className="font-semibold text-blue-600">₹{purchase.investedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Income</span>
                      <span className="font-semibold text-green-600">₹{purchase.dailyIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Income Credited</span>
                      <span className="font-semibold text-gray-800">₹{purchase.incomeCredited.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining Income</span>
                      <span className="font-semibold text-orange-600">₹{purchase.remainingIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Credit Date</span>
                      <span className="font-semibold text-gray-800">{formatDate(purchase.lastCreditDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Income Days</span>
                      <span className="font-semibold text-gray-800">{purchase.duration} days</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Day {completedDays}</span>
                      <span>Day {purchase.duration}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
