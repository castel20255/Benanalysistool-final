"use client"

import type { DigitFrequency } from "@/lib/analysis-engine"

interface DigitDistributionProps {
  frequencies: DigitFrequency[]
  currentDigit: number | null
  theme: "light" | "dark"
}

const uniqueDigitColors = [
  "from-purple-500 to-purple-600", // 0 - purple
  "from-blue-500 to-blue-600", // 1 - blue
  "from-cyan-500 to-cyan-600", // 2 - cyan
  "from-teal-500 to-teal-600", // 3 - teal
  "from-emerald-500 to-emerald-600", // 4 - emerald
  "from-lime-500 to-lime-600", // 5 - lime
  "from-amber-500 to-amber-600", // 6 - amber
  "from-orange-500 to-orange-600", // 7 - orange
  "from-red-500 to-red-600", // 8 - red
  "from-pink-500 to-pink-600", // 9 - pink
]

export function DigitDistribution({ frequencies, currentDigit, theme }: DigitDistributionProps) {
  const sorted = [...frequencies].sort((a, b) => b.count - a.count)
  const mostFrequent = sorted[0]?.digit
  const secondMost = sorted[1]?.digit
  const leastFrequent = sorted[sorted.length - 1]?.digit

  const getDigitColor = (digit: number) => {
    return `bg-gradient-to-br ${uniqueDigitColors[digit]}`
  }

  const getBarColor = (digit: number) => {
    if (digit === mostFrequent) return "bg-emerald-500"
    if (digit === secondMost) return "bg-amber-500"
    if (digit === leastFrequent) return "bg-rose-500"
    return "bg-indigo-500"
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
        {frequencies.slice(0, 5).map((freq) => {
          const isCurrentDigit = currentDigit === freq.digit
          return (
            <div key={freq.digit} className="flex flex-col items-center relative">
              {isCurrentDigit && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_0_20px_rgba(249,115,22,1)]"
                  >
                    <path d="M16 28L4 8H28L16 28Z" fill="#f97316" />
                  </svg>
                </div>
              )}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full ${getDigitColor(freq.digit)} flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                  isCurrentDigit
                    ? "ring-4 ring-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.8)] animate-pulse scale-110"
                    : "ring-2 ring-gray-500"
                }`}
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{freq.digit}</div>
                <div className="text-xs sm:text-sm font-semibold text-white">{freq.percentage.toFixed(1)}%</div>
              </div>
              <div
                className={`text-xs sm:text-sm mt-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
              >
                {freq.count}
              </div>
              <div className={`w-6 sm:w-8 h-1 ${getBarColor(freq.digit)} rounded-full mt-1`} />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
        {frequencies.slice(5, 10).map((freq) => {
          const isCurrentDigit = currentDigit === freq.digit
          return (
            <div key={freq.digit} className="flex flex-col items-center relative">
              {isCurrentDigit && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_0_20px_rgba(249,115,22,1)]"
                  >
                    <path d="M16 28L4 8H28L16 28Z" fill="#f97316" />
                  </svg>
                </div>
              )}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full ${getDigitColor(freq.digit)} flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                  isCurrentDigit
                    ? "ring-4 ring-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.8)] animate-pulse scale-110"
                    : "ring-2 ring-gray-500"
                }`}
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{freq.digit}</div>
                <div className="text-xs sm:text-sm font-semibold text-white">{freq.percentage.toFixed(1)}%</div>
              </div>
              <div
                className={`text-xs sm:text-sm mt-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
              >
                {freq.count}
              </div>
              <div className={`w-6 sm:w-8 h-1 ${getBarColor(freq.digit)} rounded-full mt-1`} />
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 flex-wrap mt-4 sm:mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500" />
          <span className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
            Most Appearing
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-500" />
          <span className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>2nd Most</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-rose-500" />
          <span className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
            Least Appearing
          </span>
        </div>
      </div>
    </div>
  )
}
