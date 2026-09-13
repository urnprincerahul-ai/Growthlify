"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { loginUser } from "@/lib/auth"

interface LoginPageProps {
  onNavigate: (page: string) => void
  onLogin: (userId: string) => void
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] ========================================")
    console.log("[v0] LOGIN FORM SUBMITTED")
    console.log("[v0] Phone:", phone)
    console.log("[v0] ========================================")

    try {
      if (!phone || phone.length !== 10) {
        throw new Error("Please enter a valid 10-digit phone number")
      }

      console.log("[v0] Calling loginUser...")
      const result = await loginUser(phone, password)
      console.log("[v0] ===== BACK IN LOGIN COMPONENT =====")
      console.log("[v0] Login result:", result)

      console.log("[v0] Saving to localStorage...")
      localStorage.setItem("userId", result.userId)
      localStorage.setItem("userName", result.user.name)
      localStorage.setItem("userPhone", phone)
      localStorage.setItem("userBalance", result.user.balance.toString())
      localStorage.setItem("totalIncome", result.user.totalIncome.toString())
      localStorage.setItem("totalRecharge", result.user.totalRecharge.toString())
      localStorage.setItem("totalWithdraw", result.user.totalWithdraw.toString())
      console.log("[v0] localStorage saved")

      console.log("[v0] Calling callbacks...")
      onLogin(result.userId)
      onNavigate("home")
      console.log("[v0] ===== LOGIN FLOW COMPLETE =====")
    } catch (err: any) {
      console.error("[v0] ===== LOGIN ERROR =====")
      console.error("[v0] Error:", err)
      console.error("[v0] Error message:", err.message)

      if (
        err.message?.includes("Firestore") ||
        err.message?.includes("permission") ||
        err.message?.includes("timeout")
      ) {
        setShowFirebaseSetup(true)
        setError("Firebase Firestore is not enabled. Click 'Setup Instructions' below.")
      } else {
        setError(err.message || "Login failed. Please try again.")
      }
    } finally {
      console.log("[v0] Setting isLoading to false")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 p-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-3xl p-8 mb-4">
            <h1 className="text-5xl font-bold text-blue-500">CNC</h1>
            <p className="text-sm text-gray-600 mt-2">ELECTRIC</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/90 text-white px-4 py-3 rounded-2xl text-sm">
              <p>{error}</p>
              {showFirebaseSetup && (
                <button
                  type="button"
                  onClick={() =>
                    window.open("https://console.firebase.google.com/project/cnc-electric/firestore", "_blank")
                  }
                  className="mt-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-xs hover:bg-gray-100"
                >
                  Open Firebase Console →
                </button>
              )}
            </div>
          )}

          {showFirebaseSetup && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Firebase Setup Required</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-medium">Follow these steps to enable Firestore:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Click the button above to open Firebase Console</li>
                  <li>Click "Create database" button</li>
                  <li>Select "Start in test mode"</li>
                  <li>Choose any location (e.g., us-central)</li>
                  <li>Click "Enable"</li>
                  <li>Wait for setup to complete (30-60 seconds)</li>
                  <li>Come back here and try logging in again</li>
                </ol>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Test mode allows read/write access for 30 days. You can update security rules
                    later.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFirebaseSetup(false)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Got it!
              </button>
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">Phone Number</label>
            <div className="flex bg-white/90 rounded-2xl overflow-hidden">
              <div className="flex items-center px-4 bg-white/50">
                <span className="text-gray-700 font-medium">+91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="flex-1 px-4 py-4 bg-transparent outline-none text-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-4 bg-white/90 rounded-2xl outline-none text-gray-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-8">
          <button onClick={() => onNavigate("register")} className="text-white font-medium">
            Don't have account, register
          </button>
        </div>
      </div>
    </div>
  )
}
