"use client"

import { Copy } from "lucide-react"

export function PromotionPage() {
  const teamLevels = [
    { level: 1, rebate: "10%", recharge: 0, members: 0 },
    { level: 2, rebate: "0%", recharge: 0, members: 0 },
    { level: 3, rebate: "0%", recharge: 0, members: 0 },
  ]

  const copyInviteCode = () => {
    navigator.clipboard.writeText("5DUTV3TJ")
    alert("Invite code copied!")
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Promotion</h1>

      <div className="bg-gray-100 rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Invite rewards</h2>
        <p className="text-gray-600 mb-4">Invest together, get rich together</p>

        <div className="flex justify-center mb-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-10-06_10-16-02-349-wFhA5L78ZmZz4EzFQ5OE9e6wFbPEt5.png"
            alt="Invite illustration"
            className="w-48 h-32 object-contain"
          />
        </div>

        <div className="bg-blue-500 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Invite Code</p>
            <p className="text-white text-2xl font-bold">5DUTV3TJ</p>
          </div>
          <button
            onClick={copyInviteCode}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
          >
            <Copy className="w-6 h-6 text-white" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-blue-500 text-center mt-6 mb-4">Team Level</h3>

        <div className="space-y-3">
          {teamLevels.map((level) => (
            <div key={level.level} className="bg-blue-500 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{level.level}</span>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2 text-white">
                <div>
                  <p className="text-xs text-blue-100">Rebate</p>
                  <p className="font-bold">{level.rebate}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-100">Recharge</p>
                  <p className="font-bold">{level.recharge}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-100">Members</p>
                  <p className="font-bold">{level.members}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
