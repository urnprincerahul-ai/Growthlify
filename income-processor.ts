export interface Investment {
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
  lastCreditDate: string
  status: "active" | "completed"
}

export interface IncomeRecord {
  id: string
  userId: string
  amount: number
  date: string
  investmentId: string
  planName: string
  type: "daily_income"
}

export function processInvestmentIncome(): {
  updatedInvestments: Investment[]
  newIncomeRecords: IncomeRecord[]
  totalNewIncome: number
} {
  const userId = localStorage.getItem("userId")
  if (!userId) {
    return { updatedInvestments: [], newIncomeRecords: [], totalNewIncome: 0 }
  }

  const investmentsStr = localStorage.getItem("userInvestments") || "[]"
  const investments: Investment[] = JSON.parse(investmentsStr)

  const incomeRecordsStr = localStorage.getItem("incomeRecords") || "[]"
  const existingIncomeRecords: IncomeRecord[] = JSON.parse(incomeRecordsStr)

  const updatedInvestments: Investment[] = []
  const newIncomeRecords: IncomeRecord[] = []
  let totalNewIncome = 0

  const now = new Date()

  investments.forEach((investment) => {
    if (investment.status !== "active") {
      updatedInvestments.push(investment)
      return
    }

    const lastCreditDate = new Date(investment.lastCreditDate)
    const purchaseDate = new Date(investment.purchaseDate)

    // Calculate how many days have passed since purchase
    const daysSincePurchase = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate how many days have passed since last credit
    const daysSinceLastCredit = Math.floor((now.getTime() - lastCreditDate.getTime()) / (1000 * 60 * 60 * 24))

    // Only credit income if at least 1 day has passed since last credit
    if (daysSinceLastCredit >= 1 && investment.daysCompleted < investment.duration) {
      // Credit income for each day that has passed
      const daysToCredit = Math.min(daysSinceLastCredit, investment.duration - investment.daysCompleted)

      for (let i = 0; i < daysToCredit; i++) {
        const incomeAmount = investment.dailyIncome
        const incomeDate = new Date(lastCreditDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000)

        // Create income record
        const incomeRecord: IncomeRecord = {
          id: `${investment.id}_${incomeDate.getTime()}`,
          userId: investment.userId,
          amount: incomeAmount,
          date: incomeDate.toISOString(),
          investmentId: investment.id,
          planName: investment.planName,
          type: "daily_income",
        }

        newIncomeRecords.push(incomeRecord)
        totalNewIncome += incomeAmount

        investment.incomeCredited += incomeAmount
        investment.remainingIncome -= incomeAmount
        investment.daysCompleted += 1
        investment.lastCreditDate = incomeDate.toISOString()
      }

      // Mark as completed if all days are done
      if (investment.daysCompleted >= investment.duration) {
        investment.status = "completed"
      }
    }

    updatedInvestments.push(investment)
  })

  // Save updated data
  if (newIncomeRecords.length > 0) {
    localStorage.setItem("userInvestments", JSON.stringify(updatedInvestments))

    const allIncomeRecords = [...newIncomeRecords, ...existingIncomeRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    localStorage.setItem("incomeRecords", JSON.stringify(allIncomeRecords))

    // Update total income and balance
    const currentTotalIncome = Number.parseFloat(localStorage.getItem("totalIncome") || "0")
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")

    localStorage.setItem("totalIncome", (currentTotalIncome + totalNewIncome).toString())
    localStorage.setItem("userBalance", (currentBalance + totalNewIncome).toString())
  }

  return { updatedInvestments, newIncomeRecords, totalNewIncome }
}

export function getIncomeRecords(userId: string): IncomeRecord[] {
  const incomeRecordsStr = localStorage.getItem("incomeRecords") || "[]"
  const allRecords: IncomeRecord[] = JSON.parse(incomeRecordsStr)
  return allRecords.filter((record) => record.userId === userId)
}
