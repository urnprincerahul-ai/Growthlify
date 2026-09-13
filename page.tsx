"use client"

import { useState, useEffect } from "react"
import { HomePage } from "@/components/home-page"
import { ProfilePage } from "@/components/profile-page"
import { PromotionPage } from "@/components/promotion-page"
import { AboutPage } from "@/components/about-page"
import { LoginPage } from "@/components/login-page"
import { RegisterPage } from "@/components/register-page"
import { RechargePage } from "@/components/recharge-page"
import { MyPurchasePage } from "@/components/my-purchase-page"
import { IncomeRecordPage } from "@/components/income-record-page"
import { WithdrawRecordPage } from "@/components/withdraw-record-page"
import { SecurityCenterPage } from "@/components/security-center-page"
import { BottomNav } from "@/components/bottom-nav"
import { FirebaseSetupModal } from "@/components/firebase-setup-modal"
import { db } from "@/lib/firebase"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { WithdrawPage } from "@/components/withdraw-page"
import { AdminPanel } from "@/components/admin-panel"
import { processInvestmentIncome } from "@/lib/income-processor"

export default function UserPanel() {
  const [currentPage, setCurrentPage] = useState("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState("")
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [isCheckingFirebase, setIsCheckingFirebase] = useState(true)

  useEffect(() => {
    const checkFirebaseSetup = async () => {
      try {
        console.log("[v0] Checking Firebase/Firestore setup...")
        const testQuery = query(collection(db, "users"), limit(1))
        await getDocs(testQuery)
        console.log("[v0] Firestore is properly configured!")
        setIsCheckingFirebase(false)
      } catch (error: any) {
        console.log("[v0] Firestore configuration error:", error.code)
        if (error.code === "permission-denied" || error.code === "unavailable") {
          console.log("[v0] Showing Firebase setup modal...")
          setShowSetupModal(true)
        }
        setIsCheckingFirebase(false)
      }
    }

    checkFirebaseSetup()
  }, [])

  useEffect(() => {
    if (isLoggedIn && userId) {
      const result = processInvestmentIncome()
      if (result.totalNewIncome > 0) {
        console.log(`[v0] Credited ₹${result.totalNewIncome.toFixed(2)} in daily income`)
      }
    }
  }, [isLoggedIn, userId, currentPage])

  const handleLogin = (id: string) => {
    setUserId(id)
    setIsLoggedIn(true)
  }

  if (showSetupModal) {
    return <FirebaseSetupModal onClose={() => setShowSetupModal(false)} />
  }

  if (isCheckingFirebase) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Checking Firebase setup...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    if (currentPage === "register") {
      return <RegisterPage onNavigate={setCurrentPage} onRegister={handleLogin} />
    }
    return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 pb-20">
      <div className="max-w-[480px] mx-auto bg-gradient-to-b from-blue-400 to-blue-300 min-h-screen">
        {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === "profile" && <ProfilePage onNavigate={setCurrentPage} onLogout={() => setIsLoggedIn(false)} />}
        {currentPage === "promotion" && <PromotionPage />}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "recharge" && <RechargePage onNavigate={setCurrentPage} />}
        {currentPage === "withdraw" && <WithdrawPage onNavigate={setCurrentPage} />}
        {currentPage === "my-purchase" && <MyPurchasePage onNavigate={setCurrentPage} />}
        {currentPage === "income-record" && <IncomeRecordPage onNavigate={setCurrentPage} />}
        {currentPage === "withdraw-record" && <WithdrawRecordPage onNavigate={setCurrentPage} />}
        {currentPage === "security-center" && <SecurityCenterPage onNavigate={setCurrentPage} />}
        {currentPage === "admin-panel" && <AdminPanel onNavigate={setCurrentPage} />}

        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
    </div>
  )
}
