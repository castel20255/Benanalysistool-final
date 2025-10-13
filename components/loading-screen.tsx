"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#1a1f3a]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Bena Analysis Tool
          </h1>
          <p className="text-gray-400 text-lg mb-2">Advanced Trading Analysis Platform</p>
          <p className="text-gray-500 text-sm">Loading your trading dashboard...</p>
        </div>

        <div className="space-y-4 mb-8">
          <Progress value={progress} className="h-3" />
          <div className="text-center">
            <span className="text-2xl font-bold text-cyan-400">{progress}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border border-blue-500/20 rounded-xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Contact Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-cyan-400 font-medium">mbuguabenson2020@gmail.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">WhatsApp:</span>
              <span className="text-cyan-400 font-medium">+254757722344</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Support:</span>
              <span className="text-emerald-400 font-medium">24/7 Available</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">© 2025 Bena Analysis Tool. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
