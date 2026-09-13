"use client"

import { useState, useEffect } from "react"
import { Wallet, ArrowRight } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { processInvestmentIncome } from "@/lib/income-processor"
import { updateUserBalance } from "@/lib/auth" // import helper to persist balance

interface HomePageProps {
  onNavigate: (page: string) => void
}

interface InvestmentPlan {
  id: number
  duration: string
  name: string
  price: number
  dailyEarnings: number
  totalGain: number
  category: "normal" | "welfare" | "offers"
  image: string
  isActive: boolean
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

export function HomePage({ onNavigate }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<"normal" | "welfare" | "offers">("welfare")
  const [userName, setUserName] = useState("User")
  const [userPhone, setUserPhone] = useState("")
  const [userBalance, setUserBalance] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [allPlans, setAllPlans] = useState<InvestmentPlan[]>([])
  const [profilePicture, setProfilePicture] = useState<string>("")

  useEffect(() => {
    const name = localStorage.getItem("userName")
    const phone = localStorage.getItem("userPhone")
    const balance = localStorage.getItem("userBalance")
    const income = localStorage.getItem("totalIncome")
    const savedProfilePic = localStorage.getItem("userProfilePicture")

    if (name) setUserName(name)
    if (phone) setUserPhone(phone)
    if (balance) setUserBalance(Number.parseFloat(balance))
    if (income) setTotalIncome(Number.parseFloat(income))
    if (savedProfilePic) setProfilePicture(savedProfilePic)

    loadPlans()

    const result = processInvestmentIncome()
    if (result.totalNewIncome > 0) {
      console.log(`[v0] Credited ₹${result.totalNewIncome.toFixed(2)} in daily income`)
      const updatedBalance = localStorage.getItem("userBalance")
      const updatedIncome = localStorage.getItem("totalIncome")
      if (updatedBalance) setUserBalance(Number.parseFloat(updatedBalance))
      if (updatedIncome) setTotalIncome(Number.parseFloat(updatedIncome))
    }
  }, [])

  const loadPlans = () => {
    try {
      const storedPlans = localStorage.getItem("investmentPlans")
      if (storedPlans) {
        const plans: InvestmentPlan[] = JSON.parse(storedPlans)
        setAllPlans(plans.filter((p) => p.isActive))
      } else {
        const defaultPlans: InvestmentPlan[] = [
          {
            id: 1,
            duration: "2 Days",
            name: "CNC Offer",
            price: 800,
            dailyEarnings: 2990,
            totalGain: 5980,
            category: "normal",
            image: "",
            isActive: true,
          },
          {
            id: 2,
            duration: "45 Days",
            name: "CNC Plan A",
            price: 296,
            dailyEarnings: 252,
            totalGain: 11340,
            category: "normal",
            image: "",
            isActive: true,
          },
          {
            id: 3,
            duration: "45 Days",
            name: "CNC Plan B",
            price: 700,
            dailyEarnings: 588,
            totalGain: 26460,
            category: "normal",
            image: "",
            isActive: true,
          },
          {
            id: 4,
            duration: "3 Days",
            name: "CNC Plan 1",
            price: 450,
            dailyEarnings: 1950,
            totalGain: 5850,
            category: "welfare",
            image: "",
            isActive: true,
          },
          {
            id: 5,
            duration: "2 Days",
            name: "CNC Plan 2",
            price: 900,
            dailyEarnings: 3200,
            totalGain: 6400,
            category: "welfare",
            image: "",
            isActive: true,
          },
          {
            id: 6,
            duration: "7 Days",
            name: "CNC Plan 3",
            price: 2400,
            dailyEarnings: 5560,
            totalGain: 38920,
            category: "welfare",
            image: "",
            isActive: true,
          },
          {
            id: 7,
            duration: "20 Days",
            name: "CNC Plan C",
            price: 1900,
            dailyEarnings: 1798,
            totalGain: 35960,
            category: "offers",
            image: "",
            isActive: true,
          },
          {
            id: 8,
            duration: "29 Days",
            name: "CNC Plan D",
            price: 3100,
            dailyEarnings: 4999,
            totalGain: 144971,
            category: "offers",
            image: "",
            isActive: true,
          },
        ]
        localStorage.setItem("investmentPlans", JSON.stringify(defaultPlans))
        setAllPlans(defaultPlans)
      }
    } catch (error) {
      console.error("[v0] Load plans error:", error)
    }
  }

  const currentPlans = allPlans.filter((plan) => plan.category === activeTab)

  const handleInvest = async (plan: InvestmentPlan) => {
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")
    const userPhone = localStorage.getItem("userPhone")
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")

    if (!userId) {
      alert("Please login first")
      onNavigate("login")
      return
    }

    if (currentBalance < plan.price) {
      alert("Insufficient balance. Please recharge first.")
      onNavigate("recharge")
      return
    }

    try {
      const newBalance = currentBalance - plan.price
      localStorage.setItem("userBalance", newBalance.toString())
      setUserBalance(newBalance)

      try {
        const res = await updateUserBalance(userId!, newBalance)
        if (!res?.success) {
          console.warn("[v0] Firestore balance update failed; kept localStorage in sync.")
        }
      } catch (e) {
        console.warn("[v0] Non-blocking: failed to persist balance to Firestore", e)
      }

      const investmentData = {
        userId,
        userName: userName || "",
        userPhone: userPhone || "",
        planName: plan.name,
        investedAmount: plan.price,
        dailyIncome: plan.dailyEarnings,
        totalIncome: plan.totalGain,
        duration: Number.parseInt(plan.duration),
        purchaseDate: new Date().toISOString(),
        incomeCredited: 0,
        remainingIncome: plan.totalGain,
        daysCompleted: 0,
        lastCreditDate: new Date().toISOString(),
        status: "active",
      }

      try {
        const investmentsRef = collection(db, "investments")
        await addDoc(investmentsRef, {
          ...investmentData,
          createdAt: serverTimestamp(),
        })
        console.log("[v0] Investment saved to Firestore")
      } catch (firestoreError) {
        console.error("[v0] Firestore save error:", firestoreError)
      }

      const existingInvestments = JSON.parse(localStorage.getItem("userInvestments") || "[]")
      existingInvestments.push({ ...investmentData, id: Date.now().toString() })
      localStorage.setItem("userInvestments", JSON.stringify(existingInvestments))

      alert(`Successfully invested ₹${plan.price} in ${plan.name}! Daily income will be credited automatically.`)
      onNavigate("my-purchase")
    } catch (error) {
      console.error("[v0] Investment error:", error)
      alert("Failed to process investment. Please try again.")
    }
  }

  const handleTelegramClick = () => {
    window.open("https://t.me/cncelectricseaportbot", "_blank")
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-blue-500 rounded-3xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <img src={profilePicture || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold">{getInitials(userName)}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-blue-100">{maskPhone(userPhone)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-blue-100 mb-1">Your Balance</p>
            <p className="text-3xl font-bold">₹{userBalance.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Total Income</p>
            <p className="text-3xl font-bold">₹{totalIncome.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button onClick={() => onNavigate("recharge")} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center mb-2">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs">Recharge</span>
          </button>
          <button onClick={() => onNavigate("withdraw")} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center mb-2">
              <ArrowRight className="w-6 h-6" />
            </div>
            <span className="text-xs">Withdraw</span>
          </button>
          <button onClick={() => onNavigate("my-purchase")} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center mb-2">
              <span className="text-2xl">💬</span>
            </div>
            <span className="text-xs">Orders</span>
          </button>
          <button onClick={handleTelegramClick} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center mb-2">
              <span className="text-2xl">✈️</span>
            </div>
            <span className="text-xs">Telegram</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("normal")}
          className={`flex-1 py-3 rounded-2xl font-semibold ${
            activeTab === "normal" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => setActiveTab("welfare")}
          className={`flex-1 py-3 rounded-2xl font-semibold ${
            activeTab === "welfare" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          Welfare
        </button>
        <button
          onClick={() => setActiveTab("offers")}
          className={`flex-1 py-3 rounded-2xl font-semibold relative ${
            activeTab === "offers" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          Offers
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">HOT</span>
        </button>
      </div>

      {/* Investment Plans */}
      <div className="space-y-4">
        {currentPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No plans available in this category</p>
          </div>
        ) : (
          currentPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="relative">
                  <span className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full z-10">
                    {plan.duration}
                  </span>
                  <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden">
                    {plan.image ? (
                      <img
                        src={plan.image || "/placeholder.svg"}
                        alt={plan.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">⚡</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Each Price</span>
                      <span className="font-semibold">₹ {plan.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Earnings</span>
                      <span className="font-semibold">₹ {plan.dailyEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Gain</span>
                      <span className="font-semibold">₹ {plan.totalGain.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInvest(plan)}
                    className="w-full bg-blue-500 text-white py-2 rounded-xl font-semibold mt-3"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
