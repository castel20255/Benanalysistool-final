"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LastDigitsChart } from "@/components/charts/last-digits-chart"
import { LastDigitsLineChart } from "@/components/charts/last-digits-line-chart"
import type { Signal, AnalysisResult } from "@/lib/analysis-engine"

interface OverUnderTabProps {
  analysis: AnalysisResult | null
  signals: Signal[]
  currentDigit: number | null
  currentPrice: number | null
  recentDigits: number[]
  theme?: "light" | "dark"
}

export function OverUnderTab({
  analysis,
  signals,
  currentDigit,
  currentPrice,
  recentDigits,
  theme = "dark",
}: OverUnderTabProps) {
  const [selectedDigit, setSelectedDigit] = useState<number>(4)

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading analysis...</p>
      </div>
    )
  }

  const last50Digits = recentDigits.slice(-50)
  const last20Digits = recentDigits.slice(-20)
  const last10Digits = recentDigits.slice(-10)

  const getUnderOverRanges = (digit: number) => {
    // 0 → 0 under | 1–9 over
    if (digit === 0) {
      return { underRange: [0], overRange: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }
    // 1 → 0–1 under | 2–9 over
    else if (digit === 1) {
      return { underRange: [0, 1], overRange: [2, 3, 4, 5, 6, 7, 8, 9] }
    }
    // 2 → 0–2 under | 3–9 over
    else if (digit === 2) {
      return { underRange: [0, 1, 2], overRange: [3, 4, 5, 6, 7, 8, 9] }
    }
    // 3 → 0–3 under | 4–9 over
    else if (digit === 3) {
      return { underRange: [0, 1, 2, 3], overRange: [4, 5, 6, 7, 8, 9] }
    }
    // 4 → 0–4 under | 5–9 over
    else if (digit === 4) {
      return { underRange: [0, 1, 2, 3, 4], overRange: [5, 6, 7, 8, 9] }
    }
    // 5 → 0–5 under | 6–9 over
    else if (digit === 5) {
      return { underRange: [0, 1, 2, 3, 4, 5], overRange: [6, 7, 8, 9] }
    }
    // 6 → 0–6 under | 7–9 over
    else if (digit === 6) {
      return { underRange: [0, 1, 2, 3, 4, 5, 6], overRange: [7, 8, 9] }
    }
    // 7 → 0–7 under | 8–9 over
    else if (digit === 7) {
      return { underRange: [0, 1, 2, 3, 4, 5, 6, 7], overRange: [8, 9] }
    }
    // 8 → 0–8 under | 9 over
    else if (digit === 8) {
      return { underRange: [0, 1, 2, 3, 4, 5, 6, 7, 8], overRange: [9] }
    }
    // 9 → 0–8 under | 9 over
    else {
      return { underRange: [0, 1, 2, 3, 4, 5, 6, 7, 8], overRange: [9] }
    }
  }

  const { underRange, overRange } = getUnderOverRanges(selectedDigit)

  const underDigits = last50Digits.filter((d) => underRange.includes(d) && d !== selectedDigit)
  const overDigits = last50Digits.filter((d) => overRange.includes(d) && d !== selectedDigit)

  const overCount = overDigits.length
  const underCount = underDigits.length
  const totalValidDigits = overCount + underCount
  const overPercent = totalValidDigits > 0 ? (overCount / totalValidDigits) * 100 : 0
  const underPercent = totalValidDigits > 0 ? (underCount / totalValidDigits) * 100 : 0

  const underInLast10 = last10Digits.filter((d) => underRange.includes(d) && d !== selectedDigit).length
  const underInLast20 = last20Digits.filter((d) => underRange.includes(d) && d !== selectedDigit).length
  const overInLast10 = last10Digits.filter((d) => overRange.includes(d) && d !== selectedDigit).length
  const overInLast20 = last20Digits.filter((d) => overRange.includes(d) && d !== selectedDigit).length

  const underPercentLast10 = (underInLast10 / (underInLast10 + overInLast10)) * 100 || 0
  const underPercentLast20 = (underInLast20 / (underInLast20 + overInLast20)) * 100 || 0
  const overPercentLast10 = (overInLast10 / (underInLast10 + overInLast10)) * 100 || 0
  const overPercentLast20 = (overInLast20 / (underInLast20 + overInLast20)) * 100 || 0

  const underIncreasing = underPercentLast10 > underPercentLast20
  const overIncreasing = overPercentLast10 > overPercentLast20

  const underDigitCounts = new Map<number, number>()
  const overDigitCounts = new Map<number, number>()

  underDigits.forEach((d) => {
    underDigitCounts.set(d, (underDigitCounts.get(d) || 0) + 1)
  })

  overDigits.forEach((d) => {
    overDigitCounts.set(d, (overDigitCounts.get(d) || 0) + 1)
  })

  let strongestUnder: number | null = null
  let maxUnderCount = 0
  underDigitCounts.forEach((count, digit) => {
    if (count > maxUnderCount) {
      maxUnderCount = count
      strongestUnder = digit
    }
  })

  let strongestOver: number | null = null
  let maxOverCount = 0
  overDigitCounts.forEach((count, digit) => {
    if (count > maxOverCount) {
      maxOverCount = count
      strongestOver = digit
    }
  })

  let marketStatus: "OVER" | "UNDER" | "NEUTRAL" = "NEUTRAL"
  let hasSignal = false
  let signalType = ""
  let entryDigit: number | null = null

  if (overPercent >= 60 && overIncreasing) {
    marketStatus = "OVER"
    hasSignal = true
    signalType = "Over"
    entryDigit = strongestOver
  } else if (underPercent >= 60 && underIncreasing) {
    marketStatus = "UNDER"
    hasSignal = true
    signalType = "Under"
    entryDigit = strongestUnder
  }

  let currentStreak = 0
  let streakType: "Over" | "Under" = "Over"
  for (let i = last50Digits.length - 1; i >= 0; i--) {
    const digit = last50Digits[i]
    if (digit === selectedDigit) continue
    const isOver = overRange.includes(digit)
    if (i === last50Digits.length - 1) {
      streakType = isOver ? "Over" : "Under"
      currentStreak = 1
    } else {
      if ((isOver && streakType === "Over") || (!isOver && streakType === "Under")) {
        currentStreak++
      } else {
        break
      }
    }
  }

  const digitBoxes = last50Digits.map((d, idx) => {
    if (d === selectedDigit) {
      return { label: "C", isOver: false, digit: d, index: idx, isCurrent: true }
    }
    const isOver = overRange.includes(d)
    return {
      label: isOver ? "O" : "U",
      isOver,
      digit: d,
      index: idx,
      isCurrent: false,
    }
  })

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl p-4 sm:p-6 border ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="text-center mb-6">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Over/Under Analysis (Selected: {selectedDigit})
          </h2>
          <Badge
            className={`text-sm px-4 py-1 ${
              marketStatus === "OVER"
                ? "bg-emerald-500 text-white"
                : marketStatus === "UNDER"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-500 text-white"
            }`}
          >
            {marketStatus} {hasSignal && `(${overIncreasing || underIncreasing ? "↗" : "↘"})`}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6">
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold text-blue-400 mb-2`}>{underPercent.toFixed(1)}%</div>
              <div
                className={`text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Under ({underRange.join(", ")}) {underIncreasing ? "↗" : "↘"}
              </div>
            </div>
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 animate-pulse-slow"
                style={{ width: `${underPercent}%` }}
              />
            </div>
            <div className={`text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Count: {underCount} | Strongest:{" "}
              <span className="inline-block bg-blue-500 text-white px-2 py-0.5 rounded font-bold">
                {strongestUnder ?? "-"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2">{overPercent.toFixed(1)}%</div>
              <div
                className={`text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Over ({overRange.join(", ")}) {overIncreasing ? "↗" : "↘"}
              </div>
            </div>
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 animate-pulse-slow"
                style={{ width: `${overPercent}%` }}
              />
            </div>
            <div className={`text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Count: {overCount} | Strongest:{" "}
              <span className="inline-block bg-emerald-500 text-white px-2 py-0.5 rounded font-bold">
                {strongestOver ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {hasSignal && (
          <div className="text-center mb-6">
            <Button
              size="lg"
              className={`text-base sm:text-lg font-bold px-6 sm:px-8 py-4 sm:py-6 ${
                signalType === "Over"
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              } text-white animate-pulse`}
            >
              TRADE NOW {signalType.toUpperCase()}
            </Button>
          </div>
        )}

        <div className="text-center">
          <div
            className={`text-base sm:text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Entry Conditions:
          </div>
          <div className={`text-sm sm:text-base font-medium ${theme === "dark" ? "text-cyan-400" : "text-cyan-700"}`}>
            {hasSignal
              ? `Enter ${signalType} when digit ${entryDigit ?? "-"} appears (highest in ${signalType} range)`
              : "Wait for market to show clear direction (55%+ and increasing)"}
          </div>
          {hasSignal && (
            <div className={`mt-2 text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Market Power: {signalType === "Over" ? overPercent.toFixed(1) : underPercent.toFixed(1)}% - Strong{" "}
              {signalType} bias detected and increasing
            </div>
          )}
        </div>
      </div>

      {last20Digits.length > 0 && (
        <div
          className={`rounded-xl p-6 border ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className={`text-xl font-bold mb-4 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Last 20 Digits
          </h3>
          <LastDigitsChart digits={last20Digits} />
        </div>
      )}

      {last20Digits.length >= 10 && (
        <div
          className={`rounded-xl p-6 border ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className={`text-xl font-bold mb-4 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Digits Line Chart
          </h3>
          <LastDigitsLineChart digits={last20Digits.slice(-10)} />
        </div>
      )}

      <div
        className={`rounded-xl p-6 border ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20"
            : "bg-white border-gray-200"
        }`}
      >
        <h3 className={`text-xl font-bold mb-4 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Select Digit for Over/Under Analysis
        </h3>

        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <Button
              key={digit}
              onClick={() => setSelectedDigit(digit)}
              variant="outline"
              className={`w-12 h-12 font-bold text-lg transition-all ${
                selectedDigit === digit
                  ? "bg-amber-500 text-white border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-110"
                  : theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300"
              }`}
            >
              {digit}
            </Button>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Over ({overRange.join(", ")})
              </span>
              <span className="text-emerald-400 font-bold text-xl">{overPercent.toFixed(1)}%</span>
            </div>
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2 animate-pulse-slow"
                style={{ width: `${overPercent}%` }}
              >
                <span className="text-white text-xs font-bold">{overCount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Under ({underRange.join(", ")})
              </span>
              <span className="text-blue-400 font-bold text-xl">{underPercent.toFixed(1)}%</span>
            </div>
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2 animate-pulse-slow"
                style={{ width: `${underPercent}%` }}
              >
                <span className="text-white text-xs font-bold">{underCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className={`text-lg font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Current Streak:
          </div>
          <div
            className={`text-3xl font-bold ${streakType === "Over" ? "text-emerald-400" : "text-blue-400"} animate-pulse`}
          >
            {currentStreak}x {streakType}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className={`text-lg font-semibold text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Last 50 Digits (U = Under, O = Over, C = Current Digit {selectedDigit})
          </h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {digitBoxes.map((box, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center font-bold text-sm transition-all ${
                  box.isCurrent
                    ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)] scale-110"
                    : box.isOver
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                }`}
                title={`Digit: ${box.digit}`}
              >
                {box.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
