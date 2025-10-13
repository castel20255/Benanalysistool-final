"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LastDigitsDisplay } from "@/components/last-digits-display"
import type { Signal, AnalysisResult } from "@/lib/analysis-engine"

interface EvenOddTabProps {
  analysis: AnalysisResult | null
  signals: Signal[]
  currentDigit: number | null
  currentPrice: number | null
  recentDigits: number[]
  theme?: "light" | "dark"
}

export function EvenOddTab({
  analysis,
  signals,
  currentDigit,
  currentPrice,
  recentDigits,
  theme = "dark",
}: EvenOddTabProps) {
  const evenOddSignal = signals?.find((s) => s.type === "even_odd")

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading analysis...</p>
      </div>
    )
  }

  const last10Digits = recentDigits.slice(-10)
  const last20Digits = recentDigits.slice(-20)

  const evenInLast10 = last10Digits.filter((d) => d % 2 === 0).length
  const evenInLast20 = last20Digits.filter((d) => d % 2 === 0).length
  const oddInLast10 = last10Digits.filter((d) => d % 2 === 1).length
  const oddInLast20 = last20Digits.filter((d) => d % 2 === 1).length

  const evenPercentLast10 = (evenInLast10 / last10Digits.length) * 100
  const evenPercentLast20 = (evenInLast20 / last20Digits.length) * 100
  const oddPercentLast10 = (oddInLast10 / last10Digits.length) * 100
  const oddPercentLast20 = (oddInLast20 / last20Digits.length) * 100

  const evenIncreasing = evenPercentLast10 > evenPercentLast20
  const oddIncreasing = oddPercentLast10 > oddPercentLast20

  let consecutiveEven = 0
  let consecutiveOdd = 0
  for (let i = recentDigits.length - 1; i >= 0; i--) {
    if (recentDigits[i] % 2 === 0) {
      if (consecutiveOdd === 0) consecutiveEven++
      else break
    } else {
      if (consecutiveEven === 0) consecutiveOdd++
      else break
    }
  }

  let signalStatus: "TRADE NOW" | "WAIT" | "NEUTRAL" = "NEUTRAL"
  let signalMessage = ""
  let entryMessage = ""

  if (analysis.evenPercentage >= 60 && evenIncreasing) {
    if (consecutiveOdd >= 2) {
      signalStatus = "TRADE NOW"
      signalMessage = `EVEN at ${analysis.evenPercentage.toFixed(1)}% and increasing - ${consecutiveOdd} consecutive ODD detected!`
      entryMessage = "Trade EVEN immediately after next even digit appears"
    } else {
      signalStatus = "WAIT"
      signalMessage = `EVEN at ${analysis.evenPercentage.toFixed(1)}% and increasing`
      entryMessage = "Wait for 2+ consecutive ODD digits, then one EVEN to trade EVEN"
    }
  } else if (analysis.oddPercentage >= 60 && oddIncreasing) {
    if (consecutiveEven >= 2) {
      signalStatus = "TRADE NOW"
      signalMessage = `ODD at ${analysis.oddPercentage.toFixed(1)}% and increasing - ${consecutiveEven} consecutive EVEN detected!`
      entryMessage = "Trade ODD immediately after next odd digit appears"
    } else {
      signalStatus = "WAIT"
      signalMessage = `ODD at ${analysis.oddPercentage.toFixed(1)}% and increasing`
      entryMessage = "Wait for 2+ consecutive EVEN digits, then one ODD to trade ODD"
    }
  } else if (analysis.evenPercentage >= 55 || analysis.oddPercentage >= 55) {
    signalStatus = "WAIT"
    const favored = analysis.evenPercentage > analysis.oddPercentage ? "EVEN" : "ODD"
    signalMessage = `${favored} at ${Math.max(analysis.evenPercentage, analysis.oddPercentage).toFixed(1)}% - threshold met but not increasing`
    entryMessage = "Wait for percentage to reach 60%+ and show increasing trend"
  } else {
    signalStatus = "NEUTRAL"
    signalMessage = "No clear bias detected"
    entryMessage = "Wait for threshold of 55%+ to be reached"
  }

  // Calculate pattern metrics
  const changeRate =
    recentDigits.length > 1
      ? (recentDigits.filter((d, i) => i > 0 && d % 2 !== recentDigits[i - 1] % 2).length / recentDigits.length) * 100
      : 0

  const reversalRate =
    recentDigits.length > 1
      ? (recentDigits.filter((d, i) => i > 0 && d % 2 !== recentDigits[i - 1] % 2).length / (recentDigits.length - 1)) *
        100
      : 0

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl p-4 border text-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        <div className={`text-sm mb-2 font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
          Current Digit:
        </div>
        {currentDigit !== null ? (
          <div
            className={`text-4xl font-bold animate-pulse ${
              theme === "dark"
                ? "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent"
                : "text-orange-600"
            }`}
          >
            {currentDigit}
          </div>
        ) : (
          <div className={`text-4xl font-bold ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>-</div>
        )}
        <div className={`text-xl mt-2 font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Price: {currentPrice?.toFixed(5) || "---"}
        </div>
      </div>

      <div
        className={`rounded-xl p-8 border ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Even vs Odd Analysis
          </h2>
          <Badge
            className={`text-lg px-4 py-2 ${
              signalStatus === "TRADE NOW"
                ? theme === "dark"
                  ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  : "bg-green-100 text-green-700 border-green-300"
                : signalStatus === "WAIT"
                  ? theme === "dark"
                    ? "bg-slate-500/20 text-slate-300 border-slate-500/30 shadow-[0_0_15px_rgba(100,116,139,0.3)]"
                    : "bg-slate-100 text-slate-700 border-slate-300"
                  : theme === "dark"
                    ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {signalStatus}
          </Badge>
        </div>

        <div
          className={`rounded-lg p-4 mb-6 ${theme === "dark" ? "bg-blue-500/10 border border-blue-500/30" : "bg-blue-50 border border-blue-200"}`}
        >
          <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Overall Summary
          </h3>
          <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
            {signalMessage}
          </p>
          <p className={`text-sm mt-2 font-semibold ${theme === "dark" ? "text-cyan-400" : "text-cyan-700"}`}>
            Consecutive: {consecutiveEven > 0 ? `${consecutiveEven} EVEN` : `${consecutiveOdd} ODD`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            className={`text-center rounded-lg p-6 border ${
              theme === "dark"
                ? "bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className={`text-5xl font-bold mb-2 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
              {analysis.evenPercentage.toFixed(1)}%
            </div>
            <div className={`text-sm mb-2 font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Even (0,2,4,6,8) {evenIncreasing ? "↗" : "↘"}
            </div>
            <div className={`w-full rounded-full h-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
              <div
                className={`h-4 rounded-full transition-all ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "bg-gradient-to-r from-blue-400 to-cyan-400"
                }`}
                style={{ width: `${analysis.evenPercentage}%` }}
              />
            </div>
            <div className={`text-sm mt-2 font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Count: {analysis.evenCount}
            </div>
          </div>

          <div
            className={`text-center rounded-lg p-6 border ${
              theme === "dark"
                ? "bg-pink-500/10 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                : "bg-pink-50 border-pink-200"
            }`}
          >
            <div className={`text-5xl font-bold mb-2 ${theme === "dark" ? "text-pink-400" : "text-pink-600"}`}>
              {analysis.oddPercentage.toFixed(1)}%
            </div>
            <div className={`text-sm mb-2 font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Odd (1,3,5,7,9) {oddIncreasing ? "↗" : "↘"}
            </div>
            <div className={`w-full rounded-full h-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
              <div
                className={`h-4 rounded-full transition-all ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-pink-500 to-red-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                    : "bg-gradient-to-r from-pink-400 to-red-400"
                }`}
                style={{ width: `${analysis.oddPercentage}%` }}
              />
            </div>
            <div className={`text-sm mt-2 font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Count: {analysis.oddCount}
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl p-8 text-center border ${
            signalStatus === "TRADE NOW"
              ? theme === "dark"
                ? "bg-green-500/20 border-green-500/50 shadow-[0_0_25px_rgba(34,197,94,0.5)]"
                : "bg-green-100 border-green-300"
              : theme === "dark"
                ? "bg-slate-500/10 border-slate-500/30 shadow-[0_0_15px_rgba(100,116,139,0.2)]"
                : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
            Entry Condition:
          </div>
          {signalStatus === "TRADE NOW" ? (
            <>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 text-xl font-bold shadow-[0_0_30px_rgba(34,197,94,0.7)] animate-pulse mb-4"
              >
                {analysis.evenPercentage > analysis.oddPercentage ? "TRADE EVEN NOW" : "TRADE ODD NOW"}
              </Button>
              <div className={`text-lg font-medium ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>
                {entryMessage}
              </div>
            </>
          ) : (
            <>
              <div className={`text-2xl font-medium mb-4 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                {entryMessage}
              </div>
              <div className={`text-base font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
                Current Status: {signalMessage}
              </div>
            </>
          )}
        </div>
      </div>

      {recentDigits.length > 0 && (
        <div
          className={`rounded-xl p-6 border ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              : "bg-white border-gray-200 shadow-lg"
          }`}
        >
          <h3 className={`text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Last 40 Digits
          </h3>
          <LastDigitsDisplay digits={recentDigits} currentDigit={currentDigit} mode="even-odd" theme={theme} />
        </div>
      )}

      <div
        className={`rounded-xl p-6 border ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        <h3 className={`text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Pattern Recognition
        </h3>
        <div
          className={`rounded-lg p-4 mb-4 ${theme === "dark" ? "bg-purple-500/10 border border-purple-500/30" : "bg-purple-50 border border-purple-200"}`}
        >
          <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
            <strong>Explanation:</strong> Pattern recognition analyzes the behavior of even and odd digits over time. A
            high change rate indicates frequent alternation between even and odd, while a high reversal rate shows the
            tendency to switch after consecutive same-type digits. Use this data to identify optimal entry points.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"}`}>
            <div className={`text-sm mb-1 font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Pattern Type
            </div>
            <div className={`text-lg font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
              {analysis.entropy > 3 ? "Unpredictable" : "Consistent"}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-purple-500/10" : "bg-purple-50"}`}>
            <div className={`text-sm mb-1 font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Change Rate
            </div>
            <div className={`text-lg font-bold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>
              {changeRate.toFixed(1)}%
            </div>
          </div>
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-green-500/10" : "bg-green-50"}`}>
            <div className={`text-sm mb-1 font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Reversal Rate
            </div>
            <div className={`text-lg font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
              {reversalRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
