"use client"

import { LayoutDashboard, Users, Package, CreditCard, DollarSign, BarChart3, Settings, LogOut } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "plans", label: "Investment Plans", icon: Package },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "withdrawals", label: "Withdrawals", icon: DollarSign },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">CNC Admin</h1>
        <p className="text-sm text-gray-400">Investment Platform</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <button className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  )
}
