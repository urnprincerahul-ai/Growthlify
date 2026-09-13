import { db } from "./firebase"
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore"

// Simple hash function for password
async function hashPassword(password: string): Promise<string> {
  try {
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    } else {
      // Fallback: simple hash (not secure, but works)
      let hash = 0
      for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }
      return Math.abs(hash).toString(16)
    }
  } catch (error) {
    console.error("[v0] Password hashing error:", error)
    // Fallback to simple hash
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }
}

export async function registerUser(name: string, phone: string, password: string, inviteCode: string) {
  console.log("[v0] ===== CUSTOM AUTH: Starting registration =====")
  console.log("[v0] Phone:", phone)
  console.log("[v0] Name:", name)

  try {
    // Check if user already exists
    const usersRef = collection(db, "users")
    console.log("[v0] Checking if user exists...")
    const q = query(usersRef, where("phone", "==", phone))

    const querySnapshot = (await Promise.race([
      getDocs(q),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Firestore query timeout. Please check your Firebase security rules.")),
          10000,
        ),
      ),
    ])) as any

    console.log("[v0] Query completed, checking results...")

    if (!querySnapshot.empty) {
      console.log("[v0] User already exists")
      throw new Error("Phone number already registered")
    }

    console.log("[v0] User doesn't exist, creating new user...")

    // Hash password
    const hashedPassword = await hashPassword(password)
    console.log("[v0] Password hashed successfully")

    console.log("[v0] Attempting to create user document in Firestore...")
    const userDoc = (await Promise.race([
      addDoc(usersRef, {
        name,
        phone,
        password: hashedPassword,
        balance: 150.0,
        totalIncome: 0,
        totalRecharge: 0,
        totalWithdraw: 0,
        inviteCode,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Firestore write timeout. Please enable Firestore in Firebase Console and set security rules to allow writes.",
              ),
            ),
          10000,
        ),
      ),
    ])) as any

    console.log("[v0] ===== User registered successfully! ID:", userDoc.id, "=====")

    return {
      success: true,
      userId: userDoc.id,
      user: {
        id: userDoc.id,
        name,
        phone,
        balance: 150.0,
      },
    }
  } catch (error: any) {
    console.error("[v0] ===== CUSTOM AUTH ERROR =====")
    console.error("[v0] Error:", error)
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error code:", error.code)

    if (error.code === "permission-denied" || error.message?.includes("permission")) {
      throw new Error(
        "Firestore permission denied. Please enable Firestore and configure security rules in Firebase Console.",
      )
    }

    if (error.message?.includes("timeout")) {
      throw new Error(error.message)
    }

    throw error
  }
}

export async function loginUser(phone: string, password: string) {
  console.log("[v0] ===== CUSTOM AUTH: Starting login =====")
  console.log("[v0] Phone:", phone)

  try {
    // Find user by phone
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("phone", "==", phone))

    const querySnapshot = (await Promise.race([
      getDocs(q),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Firestore query timeout. Please check your Firebase security rules.")),
          10000,
        ),
      ),
    ])) as any

    if (querySnapshot.empty) {
      console.log("[v0] User not found")
      throw new Error("Invalid phone number or password")
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()
    console.log("[v0] User found:", userDoc.id)

    // Verify password
    const hashedPassword = await hashPassword(password)
    if (userData.password !== hashedPassword) {
      console.log("[v0] Password mismatch")
      throw new Error("Invalid phone number or password")
    }

    console.log("[v0] ===== Login successful! =====")

    return {
      success: true,
      userId: userDoc.id,
      user: {
        id: userDoc.id,
        name: userData.name,
        phone: userData.phone,
        balance: userData.balance || 0,
        totalIncome: userData.totalIncome || 0,
        totalRecharge: userData.totalRecharge || 0,
        totalWithdraw: userData.totalWithdraw || 0,
      },
    }
  } catch (error: any) {
    console.error("[v0] ===== CUSTOM AUTH LOGIN ERROR =====")
    console.error("[v0] Error:", error)
    console.error("[v0] Error code:", error.code)

    if (error.code === "permission-denied" || error.message?.includes("permission")) {
      throw new Error(
        "Firestore permission denied. Please enable Firestore and configure security rules in Firebase Console.",
      )
    }

    if (error.message?.includes("timeout")) {
      throw new Error(error.message)
    }

    throw error
  }
}

export async function updateUserBalance(userId: string, newBalance: number) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      balance: newBalance,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("[v0] updateUserBalance error:", error)
    return { success: false, error }
  }
}
