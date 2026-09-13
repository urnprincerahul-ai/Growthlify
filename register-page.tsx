"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, User, Phone, Lock } from "lucide-react"
import { registerUser } from "@/lib/auth"

interface RegisterPageProps {
  onNavigate: (page: string) => void
  onRegister: (userId: string) => void
}

export function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    inviteCode: "NJ0STREO",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false)
  const [phoneExists, setPhoneExists] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPhoneExists(false)
    setIsLoading(true)

    console.log("[v0] ========================================")
    console.log("[v0] REGISTER FORM SUBMITTED")
    console.log("[v0] Using CUSTOM FIRESTORE AUTH (not Firebase Auth)")
    console.log("[v0] ========================================")

    try {
      if (!formData.phone || formData.phone.length !== 10) {
        throw new Error("Please enter a valid 10-digit phone number")
      }
      if (!formData.password || formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }
      if (!formData.name || formData.name.trim().length < 2) {
        throw new Error("Please enter your full name")
      }

      console.log("[v0] Form validation passed, calling registerUser...")
      const result = await registerUser(formData.name, formData.phone, formData.password, formData.inviteCode)
      console.log("[v0] ===== BACK IN REGISTER COMPONENT =====")
      console.log("[v0] Registration result:", result)

      console.log("[v0] Saving to localStorage...")
      localStorage.setItem("userId", result.userId)
      localStorage.setItem("userName", result.user.name)
      localStorage.setItem("userPhone", result.user.phone)
      localStorage.setItem("userBalance", "150")
      localStorage.setItem("totalIncome", "0")
      localStorage.setItem("totalRecharge", "0")
      console.log("[v0] localStorage saved successfully")

      console.log("[v0] Calling callbacks...")
      onRegister(result.userId)
      onNavigate("home")
      console.log("[v0] ===== REGISTRATION FLOW COMPLETE =====")
    } catch (err: any) {
      console.error("[v0] ===== REGISTRATION FORM ERROR =====")
      console.error("[v0] Error:", err)
      console.error("[v0] Error message:", err.message)

      if (
        err.message?.includes("Firestore") ||
        err.message?.includes("permission") ||
        err.message?.includes("timeout")
      ) {
        setShowFirebaseSetup(true)
        setError("Firebase Firestore is not enabled. Click 'Setup Instructions' below.")
      } else if (err.message?.includes("already registered")) {
        setPhoneExists(true)
        setError("This phone number is already registered. Please login instead.")
      } else {
        setError(err.message || "Registration failed. Please try again.")
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
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-3xl p-6">
            <h1 className="text-4xl font-bold text-blue-500">CNC</h1>
            <p className="text-xs text-gray-600 mt-1">ELECTRIC</p>
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/90 text-white px-4 py-3 rounded-2xl text-sm">
              <p>{error}</p>
              {phoneExists && (
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="mt-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-xs hover:bg-gray-100 w-full"
                >
                  Go to Login →
                </button>
              )}
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
                  <li>Come back here and try registering again</li>
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
            <label className="block text-white text-sm font-medium mb-2">NickName</label>
            <div className="flex items-center bg-white/90 rounded-2xl px-4 py-4">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter Your Full Name"
                className="flex-1 bg-transparent outline-none text-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Phone Number</label>
            <div className="flex items-center bg-white/90 rounded-2xl px-4 py-4">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter Your Mobile Number"
                className="flex-1 bg-transparent outline-none text-gray-800"
                required
                minLength={10}
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <div className="flex items-center bg-white/90 rounded-2xl px-4 py-4">
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter Your Password"
                className="flex-1 bg-transparent outline-none text-gray-800"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl px-4 py-4">
            <input
              type="text"
              value={formData.inviteCode}
              onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
              className="w-full bg-transparent outline-none text-gray-800 font-bold text-center"
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "REGISTERING..." : "REGISTER"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          {!phoneExists && (
            <button onClick={() => onNavigate("login")} className="text-white font-medium">
              Already have an account? Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
