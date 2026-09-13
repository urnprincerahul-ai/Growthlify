"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, X, Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore"

interface AdminPanelProps {
  onNavigate: (page: string) => void
}

interface RechargeRequest {
  id: string
  userId: string
  userName: string
  userPhone: string
  amount: number
  utrNumber: string
  channel: string
  status: "pending" | "approved" | "rejected"
  createdAt: any
}

interface WithdrawalRequest {
  id: string
  userId: string
  userName: string
  userPhone: string
  amount: number
  bankDetails: {
    accountName: string
    accountNumber: string
    ifscCode: string
    bankName: string
  }
  status: "pending" | "approved" | "rejected"
  requestDate: string
}

interface UserInvestment {
  id: string
  userId: string
  userName: string
  userPhone: string
  planName: string
  investedAmount: number
  dailyIncome: number
  totalIncome: number
  duration: number
  purchaseDate: string
  incomeCredited: number
  remainingIncome: number
  daysCompleted: number
  status: "active" | "completed" | "cancelled"
}

// Added UserData interface
interface UserData {
  id: string
  name: string
  phone: string
  balance: number
  totalIncome: number
  totalRecharge: number
  totalWithdraw: number
  bankDetails?: {
    accountName: string
    accountNumber: string
    ifscCode: string
    bankName: string
  }
  activeInvestments: number
  registeredDate: string
}

// Added InvestmentPlan interface
interface InvestmentPlan {
  id: number
  duration: string
  name: string
  price: number
  dailyEarnings: number
  totalGain: number
  category: "normal" | "welfare" | "offers"
  image: string // Added image field
  isActive: boolean
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"recharges" | "withdrawals" | "investments" | "users" | "plans">(
    "recharges",
  )
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [isLoading, setIsLoading] = useState(false)
  // Added states for users, plans, and plan form
  const [users, setUsers] = useState<UserData[]>([])
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === "recharges") {
        await loadRechargeRequests()
      } else if (activeTab === "withdrawals") {
        await loadWithdrawalRequests()
      } else if (activeTab === "investments") {
        await loadUserInvestments()
      } else if (activeTab === "users") {
        // Load users when tab is active
        await loadUsers()
      } else if (activeTab === "plans") {
        // Load plans when tab is active
        await loadPlans()
      }
    } catch (error) {
      console.error("[v0] Admin panel load error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRechargeRequests = async () => {
    try {
      const rechargesRef = collection(db, "rechargeRequests")
      const q = query(rechargesRef, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RechargeRequest[]
      setRechargeRequests(requests)
    } catch (error) {
      console.error("[v0] Load recharge requests error:", error)
    }
  }

  const loadWithdrawalRequests = async () => {
    try {
      const withdrawalsRef = collection(db, "withdrawalRequests")
      const q = query(withdrawalsRef, orderBy("requestDate", "desc"))
      const snapshot = await getDocs(q)
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WithdrawalRequest[]
      setWithdrawalRequests(requests)
    } catch (error) {
      console.error("[v0] Load withdrawal requests error:", error)
      // Fallback to localStorage
      const localRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]")
      setWithdrawalRequests(localRequests)
    }
  }

  const loadUserInvestments = async () => {
    try {
      const investmentsRef = collection(db, "investments")
      const q = query(investmentsRef, orderBy("purchaseDate", "desc"))
      const snapshot = await getDocs(q)
      const investments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserInvestment[]
      setUserInvestments(investments)
    } catch (error) {
      console.error("[v0] Load investments error:", error)
      // Fallback to localStorage
      const localInvestments = JSON.parse(localStorage.getItem("userInvestments") || "[]")
      setUserInvestments(localInvestments)
    }
  }

  const loadUsers = async () => {
    try {
      // In a real app, this would fetch from a users collection in Firestore
      // For now, we'll aggregate data from localStorage and investments
      const allUsers: UserData[] = []

      // Get current logged-in user
      const userId = localStorage.getItem("userId")
      const userName = localStorage.getItem("userName") || "User"
      const userPhone = localStorage.getItem("userPhone") || ""
      const balance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
      const totalIncome = Number.parseFloat(localStorage.getItem("totalIncome") || "0")
      const totalRecharge = Number.parseFloat(localStorage.getItem("totalRecharge") || "0")
      const totalWithdraw = Number.parseFloat(localStorage.getItem("totalWithdraw") || "0")

      // Get bank details
      const bankDetailsStr = localStorage.getItem("bankDetails")
      const bankDetails = bankDetailsStr ? JSON.parse(bankDetailsStr) : undefined

      // Get active investments count
      const userInvestmentsStr = localStorage.getItem("userInvestments") || "[]"
      const userInvestments = JSON.parse(userInvestmentsStr)
      const activeInvestments = userInvestments.filter((inv: any) => inv.status === "active").length

      if (userId) {
        allUsers.push({
          id: userId,
          name: userName,
          phone: userPhone,
          balance,
          totalIncome,
          totalRecharge,
          totalWithdraw,
          bankDetails,
          activeInvestments,
          registeredDate: localStorage.getItem("registeredDate") || new Date().toISOString(),
        })
      }

      setUsers(allUsers)
    } catch (error) {
      console.error("[v0] Load users error:", error)
    }
  }

  const loadPlans = async () => {
    try {
      const storedPlans = localStorage.getItem("investmentPlans")
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans))
      } else {
        // Initialize with default plans
        const defaultPlans: InvestmentPlan[] = [
          {
            id: 1,
            duration: "2 Days",
            name: "CNC Offer",
            price: 800,
            dailyEarnings: 2990,
            totalGain: 5980,
            category: "normal",
            image: "", // Default empty image
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
            image: "", // Default empty image
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
            image: "", // Default empty image
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
            image: "", // Default empty image
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
            image: "", // Default empty image
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
            image: "", // Default empty image
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
            image: "", // Default empty image
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
            image: "", // Default empty image
            isActive: true,
          },
        ]
        localStorage.setItem("investmentPlans", JSON.stringify(defaultPlans))
        setPlans(defaultPlans)
      }
    } catch (error) {
      console.error("[v0] Load plans error:", error)
    }
  }

  const handleApproveRecharge = async (request: RechargeRequest) => {
    if (!confirm(`Approve recharge of ₹${request.amount} for ${request.userName}?`)) return

    try {
      // Update in Firestore
      const rechargeRef = doc(db, "rechargeRequests", request.id)
      await updateDoc(rechargeRef, {
        status: "approved",
        approvedAt: new Date().toISOString(),
      })

      // Update user balance in localStorage (in real app, this would be in database)
      const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
      const newBalance = currentBalance + request.amount
      localStorage.setItem("userBalance", newBalance.toString())

      const currentRecharge = Number.parseFloat(localStorage.getItem("totalRecharge") || "0")
      localStorage.setItem("totalRecharge", (currentRecharge + request.amount).toString())

      alert("Recharge approved successfully!")
      await loadRechargeRequests()
    } catch (error) {
      console.error("[v0] Approve recharge error:", error)
      alert("Failed to approve recharge. Please try again.")
    }
  }

  const handleRejectRecharge = async (request: RechargeRequest) => {
    if (!confirm(`Reject recharge of ₹${request.amount} for ${request.userName}?`)) return

    try {
      const rechargeRef = doc(db, "rechargeRequests", request.id)
      await updateDoc(rechargeRef, {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      })

      alert("Recharge rejected!")
      await loadRechargeRequests()
    } catch (error) {
      console.error("[v0] Reject recharge error:", error)
      alert("Failed to reject recharge. Please try again.")
    }
  }

  const handleApproveWithdrawal = async (request: WithdrawalRequest) => {
    if (!confirm(`Approve withdrawal of ₹${request.amount} for ${request.userName}?`)) return

    try {
      // Update withdrawal status
      const localRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]")
      const updatedRequests = localRequests.map((r: WithdrawalRequest) =>
        r.id === request.id ? { ...r, status: "approved", approvedAt: new Date().toISOString() } : r,
      )
      localStorage.setItem("withdrawalRequests", JSON.stringify(updatedRequests))

      // Update user balance
      const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
      const newBalance = currentBalance - request.amount
      localStorage.setItem("userBalance", newBalance.toString())

      const currentWithdraw = Number.parseFloat(localStorage.getItem("totalWithdraw") || "0")
      localStorage.setItem("totalWithdraw", (currentWithdraw + request.amount).toString())

      alert("Withdrawal approved! Payment should be made to user's bank account.")
      await loadWithdrawalRequests()
    } catch (error) {
      console.error("[v0] Approve withdrawal error:", error)
      alert("Failed to approve withdrawal. Please try again.")
    }
  }

  const handleRejectWithdrawal = async (request: WithdrawalRequest) => {
    if (!confirm(`Reject withdrawal of ₹${request.amount} for ${request.userName}?`)) return

    try {
      const localRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]")
      const updatedRequests = localRequests.map((r: WithdrawalRequest) =>
        r.id === request.id ? { ...r, status: "rejected", rejectedAt: new Date().toISOString() } : r,
      )
      localStorage.setItem("withdrawalRequests", JSON.stringify(updatedRequests))

      alert("Withdrawal rejected!")
      await loadWithdrawalRequests()
    } catch (error) {
      console.error("[v0] Reject withdrawal error:", error)
      alert("Failed to reject withdrawal. Please try again.")
    }
  }

  const handleSavePlan = (planData: Partial<InvestmentPlan>) => {
    try {
      let updatedPlans: InvestmentPlan[]

      if (editingPlan) {
        // Update existing plan
        updatedPlans = plans.map((p) => (p.id === editingPlan.id ? { ...p, ...planData } : p))
      } else {
        // Add new plan
        const newPlan: InvestmentPlan = {
          id: Date.now(),
          duration: planData.duration || "1 Days",
          name: planData.name || "New Plan",
          price: planData.price || 0,
          dailyEarnings: planData.dailyEarnings || 0,
          totalGain: planData.totalGain || 0,
          category: planData.category || "normal",
          image: planData.image || "", // Ensure image is included
          isActive: true,
        }
        updatedPlans = [...plans, newPlan]
      }

      localStorage.setItem("investmentPlans", JSON.stringify(updatedPlans))
      setPlans(updatedPlans)
      setShowPlanForm(false)
      setEditingPlan(null)
      alert(editingPlan ? "Plan updated successfully!" : "Plan created successfully!")
    } catch (error) {
      console.error("[v0] Save plan error:", error)
      alert("Failed to save plan. Please try again.")
    }
  }

  const handleDeletePlan = (planId: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    try {
      const updatedPlans = plans.filter((p) => p.id !== planId)
      localStorage.setItem("investmentPlans", JSON.stringify(updatedPlans))
      setPlans(updatedPlans)
      alert("Plan deleted successfully!")
    } catch (error) {
      console.error("[v0] Delete plan error:", error)
      alert("Failed to delete plan. Please try again.")
    }
  }

  const handleTogglePlanStatus = (planId: number) => {
    try {
      const updatedPlans = plans.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p))
      localStorage.setItem("investmentPlans", JSON.stringify(updatedPlans))
      setPlans(updatedPlans)
    } catch (error) {
      console.error("[v0] Toggle plan status error:", error)
    }
  }

  const filteredRecharges = rechargeRequests.filter((req) => {
    const matchesSearch =
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userPhone.includes(searchTerm) ||
      req.utrNumber.includes(searchTerm)
    const matchesFilter = filterStatus === "all" || req.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredWithdrawals = withdrawalRequests.filter((req) => {
    const matchesSearch =
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) || req.userPhone.includes(searchTerm)
    const matchesFilter = filterStatus === "all" || req.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredInvestments = userInvestments.filter((inv) => {
    const matchesSearch =
      inv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.userPhone.includes(searchTerm) ||
      inv.planName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Filter for users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm)
    return matchesSearch
  })

  // Filter for plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-blue-500 pb-20">
      <div className="max-w-[480px] mx-auto">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onNavigate("profile")}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-sm text-white/80">Manage all user activities</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, UTR..."
              className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-xl outline-none"
            />
          </div>

          {/* Filter Buttons */}
          {activeTab !== "users" &&
            activeTab !== "plans" && ( // Hide filters for users and plans tabs
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      filterStatus === status ? "bg-white text-purple-600" : "bg-white/20 text-white"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-5 gap-2 p-4">
          {" "}
          {/* Increased cols to 5 */}
          <button
            onClick={() => setActiveTab("recharges")}
            className={`py-3 rounded-xl font-semibold text-xs ${
              // Reduced text size
              activeTab === "recharges" ? "bg-white text-purple-600" : "bg-white/20 text-white"
            }`}
          >
            Recharges
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`py-3 rounded-xl font-semibold text-xs ${
              // Reduced text size
              activeTab === "withdrawals" ? "bg-white text-purple-600" : "bg-white/20 text-white"
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setActiveTab("investments")}
            className={`py-3 rounded-xl font-semibold text-xs ${
              // Reduced text size
              activeTab === "investments" ? "bg-white text-purple-600" : "bg-white/20 text-white"
            }`}
          >
            Investments
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-3 rounded-xl font-semibold text-xs ${
              // Reduced text size
              activeTab === "users" ? "bg-white text-purple-600" : "bg-white/20 text-white"
            }`}
          >
            Users
          </button>
          <button // Added Plans tab button
            onClick={() => setActiveTab("plans")}
            className={`py-3 rounded-xl font-semibold text-xs ${
              activeTab === "plans" ? "bg-white text-purple-600" : "bg-white/20 text-white"
            }`}
          >
            Plans
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading...</p>
            </div>
          ) : (
            <>
              {/* Recharge Requests */}
              {activeTab === "recharges" && (
                <>
                  {filteredRecharges.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-white text-lg">No recharge requests found</p>
                    </div>
                  ) : (
                    filteredRecharges.map((request) => (
                      <div key={request.id} className="bg-white rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{request.userName}</h3>
                            <p className="text-sm text-gray-600">{request.userPhone}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : request.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {request.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-bold text-blue-600">₹{request.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">UTR Number:</span>
                            <span className="font-mono font-semibold">{request.utrNumber}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Channel:</span>
                            <span className="font-semibold">{request.channel}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Date:</span>
                            <span>
                              {request.createdAt?.toDate
                                ? new Date(request.createdAt.toDate()).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRecharge(request)}
                              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                              <Check className="w-5 h-5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRecharge(request)}
                              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Withdrawal Requests */}
              {activeTab === "withdrawals" && (
                <>
                  {filteredWithdrawals.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-white text-lg">No withdrawal requests found</p>
                    </div>
                  ) : (
                    filteredWithdrawals.map((request) => (
                      <div key={request.id} className="bg-white rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{request.userName}</h3>
                            <p className="text-sm text-gray-600">{request.userPhone}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : request.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {request.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-bold text-red-600">₹{request.amount.toFixed(2)}</span>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3 mt-3">
                            <h4 className="font-semibold text-sm mb-2">Bank Details:</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-semibold">{request.bankDetails.accountName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Account:</span>
                                <span className="font-mono">{request.bankDetails.accountNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">IFSC:</span>
                                <span className="font-mono">{request.bankDetails.ifscCode}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bank:</span>
                                <span className="font-semibold">{request.bankDetails.bankName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Request Date:</span>
                            <span>{new Date(request.requestDate).toLocaleString()}</span>
                          </div>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveWithdrawal(request)}
                              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                              <Check className="w-5 h-5" />
                              Approve & Pay
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(request)}
                              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}

              {/* User Investments */}
              {activeTab === "investments" && (
                <>
                  {filteredInvestments.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-white text-lg">No investments found</p>
                    </div>
                  ) : (
                    filteredInvestments.map((investment) => (
                      <div key={investment.id} className="bg-white rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{investment.userName}</h3>
                            <p className="text-sm text-gray-600">{investment.userPhone}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              investment.status === "active"
                                ? "bg-green-100 text-green-700"
                                : investment.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {investment.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-3 mb-3">
                          <h4 className="font-bold text-blue-600 mb-2">{investment.planName}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Invested:</span>
                              <p className="font-bold">₹{investment.investedAmount.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Daily Income:</span>
                              <p className="font-bold">₹{investment.dailyIncome.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Total Income:</span>
                              <p className="font-bold">₹{investment.totalIncome.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <p className="font-bold">{investment.duration} days</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Income Credited:</span>
                            <span className="font-semibold text-green-600">
                              ₹{investment.incomeCredited.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Remaining:</span>
                            <span className="font-semibold">₹{investment.remainingIncome.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Days Completed:</span>
                            <span className="font-semibold">
                              {investment.daysCompleted} / {investment.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Purchase Date:</span>
                            <span>{new Date(investment.purchaseDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <>
                  {selectedUser ? (
                    <div className="space-y-4">
                      <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-white mb-4">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Users
                      </button>

                      <div className="bg-white rounded-2xl p-6">
                        <h3 className="text-2xl font-bold mb-6">User Details</h3>

                        <div className="space-y-4">
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-semibold">{selectedUser.name}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-semibold">{selectedUser.phone}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Balance:</span>
                            <span className="font-bold text-green-600">₹{selectedUser.balance.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Total Income:</span>
                            <span className="font-bold text-blue-600">₹{selectedUser.totalIncome.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Total Recharge:</span>
                            <span className="font-semibold">₹{selectedUser.totalRecharge.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Total Withdraw:</span>
                            <span className="font-semibold">₹{selectedUser.totalWithdraw.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Active Investments:</span>
                            <span className="font-semibold">{selectedUser.activeInvestments}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Registered:</span>
                            <span className="font-semibold">
                              {new Date(selectedUser.registeredDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {selectedUser.bankDetails && (
                          <div className="mt-6 bg-blue-50 rounded-xl p-4">
                            <h4 className="font-bold mb-3">Bank Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Account Name:</span>
                                <span className="font-semibold">{selectedUser.bankDetails.accountName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Account Number:</span>
                                <span className="font-mono">{selectedUser.bankDetails.accountNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">IFSC Code:</span>
                                <span className="font-mono">{selectedUser.bankDetails.ifscCode}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bank Name:</span>
                                <span className="font-semibold">{selectedUser.bankDetails.bankName}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-white text-lg">No users found</p>
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <div key={user.id} className="bg-white rounded-2xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-lg">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.phone}</p>
                              </div>
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-green-50 rounded-lg p-3">
                                <span className="text-gray-600 text-xs">Balance</span>
                                <p className="font-bold text-green-600">₹{user.balance.toFixed(2)}</p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3">
                                <span className="text-gray-600 text-xs">Total Income</span>
                                <p className="font-bold text-blue-600">₹{user.totalIncome.toFixed(2)}</p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3">
                                <span className="text-gray-600 text-xs">Active Plans</span>
                                <p className="font-bold text-purple-600">{user.activeInvestments}</p>
                              </div>
                              <div className="bg-orange-50 rounded-lg p-3">
                                <span className="text-gray-600 text-xs">Total Recharge</span>
                                <p className="font-bold text-orange-600">₹{user.totalRecharge.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </>
              )}

              {/* Plans Tab */}
              {activeTab === "plans" && (
                <>
                  {showPlanForm ? (
                    <PlanForm
                      plan={editingPlan}
                      onSave={handleSavePlan}
                      onCancel={() => {
                        setShowPlanForm(false)
                        setEditingPlan(null)
                      }}
                    />
                  ) : (
                    <>
                      <button
                        onClick={() => setShowPlanForm(true)}
                        className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mb-4"
                      >
                        <Plus className="w-5 h-5" />
                        Add New Plan
                      </button>

                      {filteredPlans.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-white text-lg">No plans found</p>
                        </div>
                      ) : (
                        filteredPlans.map((plan) => (
                          <div key={plan.id} className="bg-white rounded-2xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-lg">{plan.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {plan.category} • {plan.duration}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingPlan(plan)
                                    setShowPlanForm(true)
                                  }}
                                  className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePlan(plan.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                              <div className="bg-blue-50 rounded-lg p-2">
                                <span className="text-gray-600 text-xs">Price</span>
                                <p className="font-bold">₹{plan.price}</p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-2">
                                <span className="text-gray-600 text-xs">Daily</span>
                                <p className="font-bold">₹{plan.dailyEarnings}</p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-2">
                                <span className="text-gray-600 text-xs">Total</span>
                                <p className="font-bold">₹{plan.totalGain}</p>
                              </div>
                            </div>

                            {plan.image && (
                              <div className="mb-3">
                                <img
                                  src={plan.image || "/placeholder.svg"}
                                  alt={`${plan.name} image`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                            )}

                            <button
                              onClick={() => handleTogglePlanStatus(plan.id)}
                              className={`w-full py-2 rounded-lg font-semibold ${
                                plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {plan.isActive ? "Active" : "Inactive"}
                            </button>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function PlanForm({
  plan,
  onSave,
  onCancel,
}: {
  plan: InvestmentPlan | null
  onSave: (data: Partial<InvestmentPlan>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    duration: plan?.duration || "",
    price: plan?.price?.toString() || "",
    dailyEarnings: plan?.dailyEarnings?.toString() || "",
    totalGain: plan?.totalGain?.toString() || "",
    category: plan?.category || "normal",
    image: plan?.image || "", // Added image field
  })

  const [imagePreview, setImagePreview] = useState<string>(plan?.image || "")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData({ ...formData, image: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url)
    setFormData({ ...formData, image: url })
  }

  const handleRemoveImage = () => {
    setImagePreview("")
    setFormData({ ...formData, image: "" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: Number.parseFloat(formData.price) || 0,
      dailyEarnings: Number.parseFloat(formData.dailyEarnings) || 0,
      totalGain: Number.parseFloat(formData.totalGain) || 0,
    })
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6">{plan ? "Edit Plan" : "Create New Plan"}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Plan Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Duration (e.g., "2 Days")</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="welfare">Welfare</option>
            <option value="offers">Offers</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Price (₹)</label>
          <input
            type="text" // Changed to text to handle string input
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Daily Earnings (₹)</label>
          <input
            type="text" // Changed to text to handle string input
            value={formData.dailyEarnings}
            onChange={(e) => setFormData({ ...formData, dailyEarnings: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Total Gain (₹)</label>
          <input
            type="text" // Changed to text to handle string input
            value={formData.totalGain}
            onChange={(e) => setFormData({ ...formData, totalGain: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Plan Image/Logo (Optional)</label>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Plan preview"
                className="w-full h-48 object-cover rounded-xl border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                Remove
              </button>
            </div>
          )}

          {/* Upload Options */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Max size: 2MB. Formats: JPG, PNG, GIF</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image.startsWith("data:") ? "" : formData.image}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold">
            {plan ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  )
}
