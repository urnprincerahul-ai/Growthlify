"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, LogOut, Camera } from "lucide-react"

interface ProfilePageProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function maskPhone(phone: string): string {
  if (phone.length >= 10) {
    return phone.slice(0, 6) + "**" + phone.slice(-2)
  }
  return phone
}

export function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
  const [userName, setUserName] = useState("User")
  const [userPhone, setUserPhone] = useState("")
  const [userBalance, setUserBalance] = useState(0)
  const [totalRecharge, setTotalRecharge] = useState(0)
  const [totalWithdraw, setTotalWithdraw] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [tapCount, setTapCount] = useState(0)
  const [profilePicture, setProfilePicture] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const name = localStorage.getItem("userName")
    const phone = localStorage.getItem("userPhone")
    const balance = localStorage.getItem("userBalance")
    const recharge = localStorage.getItem("totalRecharge")
    const withdraw = localStorage.getItem("totalWithdraw")
    const adminStatus = localStorage.getItem("isAdmin")
    const savedProfilePic = localStorage.getItem("userProfilePicture")

    if (name) setUserName(name)
    if (phone) setUserPhone(phone)
    if (balance) setUserBalance(Number.parseFloat(balance))
    if (recharge) setTotalRecharge(Number.parseFloat(recharge))
    if (withdraw) setTotalWithdraw(Number.parseFloat(withdraw))
    if (adminStatus === "true") setIsAdmin(true)
    if (savedProfilePic) setProfilePicture(savedProfilePic)
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfilePicture(base64String)
        localStorage.setItem("userProfilePicture", base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProfilePicture = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarTap = () => {
    const newCount = tapCount + 1
    setTapCount(newCount)

    if (newCount >= 5) {
      setShowAdminLogin(true)
      setTapCount(0)
    }

    setTimeout(() => setTapCount(0), 2000)
  }

  const handleAdminLogin = () => {
    if (adminUsername === "cncadmin" && adminPassword === "cncadmin@1312") {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      setShowAdminLogin(false)
      setAdminUsername("")
      setAdminPassword("")
      alert("Admin access granted!")
    } else {
      alert("Invalid credentials!")
      setAdminUsername("")
      setAdminPassword("")
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
  }

  const handleTelegramClick = () => {
    window.open("https://t.me/cncelectricseaportbot", "_blank")
  }

  const menuItems = [
    { id: "about", label: "About Company", icon: "🏢" },
    { id: "income-record", label: "Income Record", icon: "💰" },
    { id: "withdraw-record", label: "Withdraw Record", icon: "☁️" },
    { id: "security-center", label: "Security Manager", icon: "🔒" },
    { id: "download", label: "App Download", icon: "🔄" },
    { id: "help", label: "Help", icon: "❓" },
  ]

  return (
    <div className="p-4">
      <div className="bg-white rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <button
              onClick={handleAvatarTap}
              className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center overflow-hidden"
            >
              {profilePicture ? (
                <img src={profilePicture || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">{getInitials(userName)}</span>
              )}
            </button>
            <button
              onClick={handleEditProfilePicture}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-gray-500">{maskPhone(userPhone)}</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Account Balance</span>
            <button
              onClick={() => onNavigate("recharge")}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-semibold"
            >
              Recharge 💰
            </button>
          </div>
          <p className="text-3xl font-bold text-blue-500">₹{userBalance.toFixed(2)}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-blue-500 rounded-2xl p-4 text-white">
          <div className="text-center">
            <p className="text-2xl font-bold">₹{userBalance.toFixed(0)}</p>
            <p className="text-xs text-blue-100">Balance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">₹{totalRecharge.toFixed(0)}</p>
            <p className="text-xs text-blue-100">Recharge</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">₹{totalWithdraw.toFixed(0)}</p>
            <p className="text-xs text-blue-100">Withdraw</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden mb-6">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => (item.id === "help" ? handleTelegramClick() : onNavigate(item.id))}
            className={`w-full flex items-center justify-between p-4 ${
              index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">{item.icon}</span>
              </div>
              <span className="font-medium text-blue-500">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mb-4"
      >
        <LogOut className="w-5 h-5" />
        LOGOUT
      </button>

      {isAdmin && (
        <button
          onClick={() => onNavigate("admin-panel")}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mb-4"
        >
          <span className="text-xl">⚙️</span>
          ADMIN PANEL
        </button>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-center">Admin Login</h3>
            <input
              type="text"
              placeholder="Username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl mb-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdminLogin(false)
                  setAdminUsername("")
                  setAdminPassword("")
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
