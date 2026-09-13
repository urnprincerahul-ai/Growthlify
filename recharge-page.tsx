"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface RechargePageProps {
  onNavigate: (page: string) => void
}

export function RechargePage({ onNavigate }: RechargePageProps) {
  const [amount, setAmount] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("channel-a")
  const [showUTRForm, setShowUTRForm] = useState(false)
  const [utrNumber, setUtrNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const presetAmounts = [800, 296, 450, 700, 1000, 1200, 1800, 3100, 4800]

  const UPI_ID = "lakkhikanta.m@ptyes"

  const handleRechargeClick = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    console.log("[v0] Initiating UPI payment for amount:", amount)

    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=CNC Electric&am=${amount}&cu=INR&tn=Recharge for CNC Electric`

    console.log("[v0] UPI URL:", upiUrl)

    // Try to open UPI payment app in new window
    const paymentWindow = window.open(upiUrl, "_blank")

    // If popup was blocked or UPI app didn't open, provide fallback
    if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed === "undefined") {
      console.log("[v0] Popup blocked or UPI app not available, trying direct redirect")
      // Try direct redirect as fallback
      window.location.href = upiUrl
    }

    // Show UTR form immediately so user can submit after payment
    console.log("[v0] Showing UTR form")
    setShowUTRForm(true)
  }

  const handleUTRSubmit = async () => {
    if (!utrNumber.trim()) {
      alert("Please enter UTR number")
      return
    }

    if (utrNumber.trim().length < 12) {
      alert("UTR number should be 12 digits")
      return
    }

    setIsSubmitting(true)

    try {
      const userId = localStorage.getItem("userId") || "unknown"
      const userName = localStorage.getItem("userName") || "Unknown User"
      const userPhone = localStorage.getItem("userPhone") || "Unknown"

      console.log("[v0] Submitting recharge request:", {
        userId,
        userName,
        userPhone,
        amount,
        utrNumber,
      })

      const rechargesRef = collection(db, "rechargeRequests")
      await addDoc(rechargesRef, {
        userId,
        userName,
        userPhone,
        amount: Number.parseFloat(amount),
        utrNumber: utrNumber.trim(),
        channel: selectedChannel,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      console.log("[v0] Recharge request submitted successfully")

      alert(`Recharge request submitted! Your balance will be updated after admin approval (5-10 minutes).`)

      // Reset form
      setAmount("")
      setUtrNumber("")
      setShowUTRForm(false)
      onNavigate("home")
    } catch (error) {
      console.error("[v0] Recharge submission error:", error)
      alert("Failed to submit recharge request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showUTRForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowUTRForm(false)}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white ml-4">Submit UTR Number</h1>
          </div>

          <div className="bg-white rounded-3xl p-6 space-y-6">
            <div className="bg-blue-50 rounded-2xl p-4 mb-4">
              <h3 className="font-bold text-blue-600 mb-2">Payment Instructions</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. Complete the payment in your UPI app</li>
                <li>2. Copy the UTR/Transaction ID from payment confirmation</li>
                <li>3. Enter the UTR number below and submit</li>
                <li>4. Wait for admin approval (5-10 minutes)</li>
              </ol>
            </div>

            <div className="text-center mb-4">
              <p className="text-gray-700 mb-2">Payment Amount</p>
              <p className="text-3xl font-bold text-blue-600">₹{amount}</p>
              <p className="text-sm text-gray-500 mt-2">UPI ID: {UPI_ID}</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter UTR/Transaction Reference Number
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="Enter 12-digit UTR number"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-800 text-lg"
                maxLength={12}
              />
              <p className="text-xs text-gray-500 mt-2">
                You can find the UTR number in your payment app transaction details
              </p>
            </div>

            <button
              onClick={handleUTRSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit UTR Number"}
            </button>

            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-blue-600 mb-2">Important</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Enter the correct UTR number from your payment</li>
                <li>• Admin will verify and approve your recharge</li>
                <li>• Balance will be credited after approval</li>
                <li>• This usually takes 5-10 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-white ml-4">Recharge</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">Enter Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Recharge Amount"
              className="w-full px-4 py-4 bg-white rounded-2xl outline-none text-gray-800 text-lg"
            />
          </div>

          {/* Preset Amounts */}
          <div className="grid grid-cols-3 gap-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="bg-white/80 hover:bg-white py-3 rounded-xl font-semibold text-gray-700 transition"
              >
                ₹{preset}
              </button>
            ))}
          </div>

          {/* Payment Channels */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">Online Channel</label>
            <div className="space-y-3">
              <label className="flex items-center bg-blue-500 text-white p-4 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="channel"
                  value="channel-a"
                  checked={selectedChannel === "channel-a"}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-5 h-5 mr-3"
                />
                <span className="font-semibold">Channel A</span>
              </label>

              <label className="flex items-center bg-white p-4 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="channel"
                  value="channel-c"
                  checked={selectedChannel === "channel-c"}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-5 h-5 mr-3"
                />
                <span className="font-semibold text-gray-700">Channel C</span>
              </label>

              <label className="flex items-center bg-white p-4 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="channel"
                  value="pay-fast"
                  checked={selectedChannel === "pay-fast"}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-5 h-5 mr-3"
                />
                <span className="font-semibold text-gray-700">PAY - Fast</span>
              </label>
            </div>
          </div>

          {/* Recharge Button */}
          <button
            onClick={handleRechargeClick}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition"
          >
            Recharge Now
          </button>

          {/* Instructions */}
          <div className="bg-white/90 rounded-2xl p-4">
            <h3 className="font-bold text-blue-600 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-600 mr-2"></span>
              Explain
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>
                1. Please do not modify the deposit amount. Unauthorized modification of the deposit amount will result
                in the deposit not being credited
              </li>
              <li>
                2. Each deposit requires payment to be initiated through this page, please do not save the payment
              </li>
              <li>
                3. Deposit received within 5 minutes, if not received within 5 minutes, please contact online customer
                service for processing
              </li>
              <li>
                4. Due to too many deposit users, please try multiple times to obtain the deposit link or try again
                after a period of time
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
