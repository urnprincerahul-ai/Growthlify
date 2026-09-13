import { db } from "./firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

// User Management
export async function createUser(userData: {
  name: string
  phone: string
  email?: string
  password: string
}) {
  const usersRef = collection(db, "users")
  return await addDoc(usersRef, {
    ...userData,
    balance: 0,
    totalIncome: 0,
    totalRecharge: 0,
    totalWithdraw: 0,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getUsers() {
  const usersRef = collection(db, "users")
  const snapshot = await getDocs(usersRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function updateUser(userId: string, data: any) {
  const userRef = doc(db, "users", userId)
  return await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteUser(userId: string) {
  const userRef = doc(db, "users", userId)
  return await deleteDoc(userRef)
}

// Investment Plans Management
export async function createInvestmentPlan(planData: {
  name: string
  category: "normal" | "welfare" | "offers"
  duration: number
  price: number
  dailyEarnings: number
  totalGain: number
  image?: string
}) {
  const plansRef = collection(db, "investmentPlans")
  return await addDoc(plansRef, {
    ...planData,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getInvestmentPlans() {
  const plansRef = collection(db, "investmentPlans")
  const snapshot = await getDocs(query(plansRef, where("status", "==", "active")))
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function updateInvestmentPlan(planId: string, data: any) {
  const planRef = doc(db, "investmentPlans", planId)
  return await updateDoc(planRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Recharge Requests Management
export async function createRechargeRequest(requestData: {
  userId: string
  userName: string
  userPhone: string
  amount: number
  channel: string
  utrNumber: string
}) {
  const rechargesRef = collection(db, "rechargeRequests")
  return await addDoc(rechargesRef, {
    ...requestData,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getRechargeRequests(status?: string) {
  const rechargesRef = collection(db, "rechargeRequests")
  let q = query(rechargesRef, orderBy("createdAt", "desc"))

  if (status) {
    q = query(rechargesRef, where("status", "==", status), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function approveRecharge(requestId: string, userId: string, amount: number) {
  // Update recharge request status
  const requestRef = doc(db, "rechargeRequests", requestId)
  await updateDoc(requestRef, {
    status: "approved",
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  // Update user balance
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)

  if (userDoc.exists()) {
    const currentBalance = userDoc.data().balance || 0
    const currentTotalRecharge = userDoc.data().totalRecharge || 0

    await updateDoc(userRef, {
      balance: currentBalance + amount,
      totalRecharge: currentTotalRecharge + amount,
      updatedAt: serverTimestamp(),
    })
  }

  // Create transaction record
  const transactionsRef = collection(db, "transactions")
  await addDoc(transactionsRef, {
    userId,
    type: "recharge",
    amount,
    status: "completed",
    requestId,
    createdAt: serverTimestamp(),
  })
}

export async function rejectRecharge(requestId: string, reason: string) {
  const requestRef = doc(db, "rechargeRequests", requestId)
  return await updateDoc(requestRef, {
    status: "rejected",
    rejectionReason: reason,
    rejectedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// Transactions Management
export async function getTransactions(userId?: string) {
  const transactionsRef = collection(db, "transactions")
  let q = query(transactionsRef, orderBy("createdAt", "desc"))

  if (userId) {
    q = query(transactionsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// User Investments Management
export async function createUserInvestment(investmentData: {
  userId: string
  userName: string
  planId: string
  planName: string
  amount: number
  dailyIncome: number
  totalIncome: number
  duration: number
}) {
  const investmentsRef = collection(db, "userInvestments")
  return await addDoc(investmentsRef, {
    ...investmentData,
    incomeCredited: 0,
    remainingIncome: investmentData.totalIncome,
    daysCompleted: 0,
    lastCreditDate: null,
    status: "active",
    purchaseDate: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getUserInvestments(userId: string) {
  const investmentsRef = collection(db, "userInvestments")
  const q = query(investmentsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Income Records Management
export async function createIncomeRecord(incomeData: {
  userId: string
  investmentId: string
  amount: number
  type: "daily" | "referral" | "bonus"
}) {
  const incomeRef = collection(db, "incomeRecords")
  return await addDoc(incomeRef, {
    ...incomeData,
    createdAt: serverTimestamp(),
  })
}

export async function getIncomeRecords(userId: string) {
  const incomeRef = collection(db, "incomeRecords")
  const q = query(incomeRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Withdrawal Requests Management
export async function createWithdrawalRequest(requestData: {
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
}) {
  const withdrawalsRef = collection(db, "withdrawalRequests")
  return await addDoc(withdrawalsRef, {
    ...requestData,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getWithdrawalRequests(status?: string) {
  const withdrawalsRef = collection(db, "withdrawalRequests")
  let q = query(withdrawalsRef, orderBy("createdAt", "desc"))

  if (status) {
    q = query(withdrawalsRef, where("status", "==", status), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function approveWithdrawal(requestId: string, userId: string, amount: number) {
  // Update withdrawal request status
  const requestRef = doc(db, "withdrawalRequests", requestId)
  await updateDoc(requestRef, {
    status: "approved",
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  // Update user balance and total withdraw
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)

  if (userDoc.exists()) {
    const currentBalance = userDoc.data().balance || 0
    const currentTotalWithdraw = userDoc.data().totalWithdraw || 0

    await updateDoc(userRef, {
      balance: currentBalance - amount,
      totalWithdraw: currentTotalWithdraw + amount,
      updatedAt: serverTimestamp(),
    })
  }

  // Create transaction record
  const transactionsRef = collection(db, "transactions")
  await addDoc(transactionsRef, {
    userId,
    type: "withdrawal",
    amount,
    status: "completed",
    requestId,
    createdAt: serverTimestamp(),
  })
}

export async function rejectWithdrawal(requestId: string, reason: string) {
  const requestRef = doc(db, "withdrawalRequests", requestId)
  return await updateDoc(requestRef, {
    status: "rejected",
    rejectionReason: reason,
    rejectedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getUserWithdrawals(userId: string) {
  const withdrawalsRef = collection(db, "withdrawalRequests")
  const q = query(withdrawalsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
