"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface WithdrawPageProps {
  onNavigate: (page: string) => void
}

export function WithdrawPage({ onNavigate }: WithdrawPageProps) {
  const [amount, setAmount] = useState("")
  const [userBalance, setUserBalance] = useState(0)
  const [totalRecharge, setTotalRecharge] = useState(0)
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const balance = localStorage.getItem("userBalance")
    const recharge = localStorage.getItem("totalRecharge")
    const savedBankDetails = localStorage.getItem("userBankDetails")

    if (balance) setUserBalance(Number.parseFloat(balance))
    if (recharge) setTotalRecharge(Number.parseFloat(recharge))
    if (savedBankDetails) {
      setBankDetails(JSON.parse(savedBankDetails))
    }
  }, [])

  const handleWithdraw = async () => {
    setError("")

    if (totalRecharge < 499) {
      setError("You must recharge at least ₹499 before you can withdraw")
      return
    }

    const withdrawAmount = Number.parseFloat(amount)

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (withdrawAmount > userBalance) {
      setError("Insufficient balance")
      return
    }

    if (withdrawAmount < 100) {
      setError("Minimum withdrawal amount is ₹100")
      return
    }

    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName) {
      setError("Please fill in all bank details")
      return
    }

    setIsLoading(true)

    try {
      const userId = localStorage.getItem("userId")
      const userName = localStorage.getItem("userName")
      const userPhone = localStorage.getItem("userPhone")

      localStorage.setItem("userBankDetails", JSON.stringify(bankDetails))

      const withdrawalRequest = {
        userId,
        userName,
        userPhone,
        amount: withdrawAmount,
        bankDetails,
        status: "pending",
        requestDate: new Date().toISOString(),
      }

      try {
        const withdrawalsRef = collection(db, "withdrawalRequests")
        await addDoc(withdrawalsRef, {
          ...withdrawalRequest,
          createdAt: serverTimestamp(),
        })
        console.log("[v0] Withdrawal request saved to Firestore")
      } catch (firestoreError) {
        console.error("[v0] Firestore save error:", firestoreError)
      }

      const existingWithdrawals = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]")
      existingWithdrawals.push({ ...withdrawalRequest, id: Date.now().toString() })
      localStorage.setItem("withdrawalRequests", JSON.stringify(existingWithdrawals))

      const userWithdrawals = JSON.parse(localStorage.getItem(`userWithdrawals_${userId}`) || "[]")
      userWithdrawals.push({
        id: Date.now().toString(),
        amount: withdrawAmount,
        status: "pending",
        date: new Date().toISOString(),
        accountNumber: `****${bankDetails.accountNumber.slice(-4)}`,
        bankName: bankDetails.bankName,
      })
      localStorage.setItem(`userWithdrawals_${userId}`, JSON.stringify(userWithdrawals))

      alert("Withdrawal request submitted successfully! Please wait for admin approval.")
      onNavigate("home")
    } catch (err) {
      console.error("[v0] Withdrawal error:", err)
      setError("Failed to submit withdrawal request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const canWithdraw = totalRecharge >= 499

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 p-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => onNavigate("home")}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Withdraw</h1>
      </div>

      {!canWithdraw && (
        <div className="bg-red-500/90 text-white p-4 rounded-2xl mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">Withdrawal Locked</p>
            <p className="text-sm">You must recharge at least ₹499 before you can withdraw funds.</p>
            <p className="text-sm mt-2">Current recharge: ₹{totalRecharge.toFixed(2)}</p>
            <p className="text-sm">Required: ₹499.00</p>
            <button
              onClick={() => onNavigate("recharge")}
              className="mt-3 bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100"
            >
              Recharge Now →
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 mb-4">
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-blue-600">₹{userBalance.toFixed(2)}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Withdrawal Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!canWithdraw}
          />
          <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: ₹100</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[500, 1000, 2000].map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              className="py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 disabled:opacity-50"
              disabled={!canWithdraw}
            >
              ₹{preset}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-800">Bank Details</h3>

          <input
            type="text"
            value={bankDetails.accountName}
            onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
            placeholder="Account Holder Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!canWithdraw}
          />

          <input
            type="text"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            placeholder="Account Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!canWithdraw}
          />

          <input
            type="text"
            value={bankDetails.ifscCode}
            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
            placeholder="IFSC Code"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!canWithdraw}
          />

          <input
            type="text"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            placeholder="Bank Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!canWithdraw}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={isLoading || !canWithdraw}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Submit Withdrawal"}
        </button>
      </div>

      <div className="bg-white/90 rounded-2xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Important Notes</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Minimum withdrawal amount is ₹100</li>
          <li>• You must recharge at least ₹499 to unlock withdrawals</li>
          <li>• Withdrawal requests are processed within 24-48 hours</li>
          <li>• Ensure your bank details are correct</li>
          <li>• Your bank details will be saved for future withdrawals</li>
        </ul>
      </div>
    </div>
  )
}
