"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Zap, ScrollText } from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis-engine"

interface SuperSignal {
  id: string
  market: string
  tradeType: string
  entryPoint: string | number
  exitCondition: string
  tradeValidity: number
  confidence: number
  signal: "TRADE NOW" | "WAIT" | "STRONG"
  marketPower: number
  timestamp: number
  patternStrength: number
}

interface SuperSignalsTabProps {
  analysis: AnalysisResult | null
  currentDigit: number | null
  recentDigits: number[]
  theme?: "light" | "dark"
}

export function SuperSignalsTab({ analysis, currentDigit, recentDigits, theme = "dark" }: SuperSignalsTabProps) {
  const [superSignals, setSuperSignals] = useState<SuperSignal[]>([])
  const [isScanning, setIsScanning] = useState(true)
  const [showLogs, setShowLogs] = useState(false)
  const [scanLogs, setScanLogs] = useState<string[]>([])

  useEffect(() => {
    if (!analysis) return

    const scanInterval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString()
      const newSignals = generateSuperSignals(analysis, currentDigit, recentDigits)
      setSuperSignals(newSignals)

      const logMessage = `[${timestamp}] Scanned all strategies - Found ${newSignals.length} signals`
      setScanLogs((prev) => [...prev.slice(-19), logMessage])
    }, 2000)

    return () => clearInterval(scanInterval)
  }, [analysis, currentDigit, recentDigits])

  const generateSuperSignals = (
    analysis: AnalysisResult,
    currentDigit: number | null,
    recentDigits: number[],
  ): SuperSignal[] => {
    const signals: SuperSignal[] = []

    if (analysis.highPercentage >= 65) {
      signals.push({
        id: `over-under-${Date.now()}`,
        market: "All Volatilities",
        tradeType: "Over 4.5",
        entryPoint: analysis.powerIndex.strongest,
        exitCondition: "When percentage drops below 60%",
        tradeValidity: calculateTradeValidity(analysis.highPercentage, recentDigits),
        confidence: analysis.highPercentage,
        signal: analysis.highPercentage >= 70 ? "STRONG" : "TRADE NOW",
        marketPower: analysis.powerIndex.gap,
        timestamp: Date.now(),
        patternStrength: calculatePatternStrength(recentDigits, (d) => d >= 5),
      })
    }

    if (analysis.lowPercentage >= 65) {
      signals.push({
        id: `under-${Date.now()}`,
        market: "All Volatilities",
        tradeType: "Under 4.5",
        entryPoint: analysis.powerIndex.strongest,
        exitCondition: "When percentage drops below 60%",
        tradeValidity: calculateTradeValidity(analysis.lowPercentage, recentDigits),
        confidence: analysis.lowPercentage,
        signal: analysis.lowPercentage >= 70 ? "STRONG" : "TRADE NOW",
        marketPower: analysis.powerIndex.gap,
        timestamp: Date.now(),
        patternStrength: calculatePatternStrength(recentDigits, (d) => d < 5),
      })
    }

    const digits012 = [0, 1, 2].map((d) => analysis.digitFrequencies[d])
    const below10_012 = digits012.filter((d) => d.percentage < 10).length

    if (below10_012 >= 2) {
      const entryDigit = digits012.find((d) => d.percentage > 10)
      if (entryDigit) {
        signals.push({
          id: `over2-${Date.now()}`,
          market: "All Volatilities",
          tradeType: "Over 2",
          entryPoint: entryDigit.digit,
          exitCondition: "When 2+ digits in 0,1,2 exceed 10%",
          tradeValidity: 5,
          confidence: 85 + entryDigit.percentage,
          signal: "STRONG",
          marketPower: 100 - digits012.reduce((sum, d) => sum + d.percentage, 0),
          timestamp: Date.now(),
          patternStrength: 90,
        })
      }
    }

    const digits789 = [7, 8, 9].map((d) => analysis.digitFrequencies[d])
    const below10_789 = digits789.filter((d) => d.percentage < 10).length

    if (below10_789 >= 2) {
      const entryDigit = digits789.find((d) => d.percentage > 10)
      if (entryDigit) {
        signals.push({
          id: `under7-${Date.now()}`,
          market: "All Volatilities",
          tradeType: "Under 7",
          entryPoint: entryDigit.digit,
          exitCondition: "When 2+ digits in 7,8,9 exceed 10%",
          tradeValidity: 5,
          confidence: 85 + entryDigit.percentage,
          signal: "STRONG",
          marketPower: 100 - digits789.reduce((sum, d) => sum + d.percentage, 0),
          timestamp: Date.now(),
          patternStrength: 90,
        })
      }
    }

    const under4Count = recentDigits.filter((d) => d <= 3).length
    const over6Count = recentDigits.filter((d) => d >= 7).length

    if (under4Count / recentDigits.length >= 0.65) {
      signals.push({
        id: `under6-${Date.now()}`,
        market: "All Volatilities",
        tradeType: "Under 6",
        entryPoint: "Wait for highest digit in 0-6 range",
        exitCondition: "When over digits increase above 35%",
        tradeValidity: 7,
        confidence: (under4Count / recentDigits.length) * 100,
        signal: "TRADE NOW",
        marketPower: 75,
        timestamp: Date.now(),
        patternStrength: 85,
      })
    }

    if (over6Count / recentDigits.length >= 0.65) {
      signals.push({
        id: `over3-${Date.now()}`,
        market: "All Volatilities",
        tradeType: "Over 3",
        entryPoint: "Wait for highest digit in 4-9 range",
        exitCondition: "When under digits increase above 35%",
        tradeValidity: 7,
        confidence: (over6Count / recentDigits.length) * 100,
        signal: "TRADE NOW",
        marketPower: 75,
        timestamp: Date.now(),
        patternStrength: 85,
      })
    }

    const digit0 = analysis.digitFrequencies[0]
    const digit1 = analysis.digitFrequencies[1]

    if (digit0.percentage < 10 && digit1.percentage < 10 && analysis.highPercentage >= 90) {
      signals.push({
        id: `over1-${Date.now()}`,
        market: "All Volatilities",
        tradeType: "Over 1",
        entryPoint: "Wait for 1+ under digits",
        exitCondition: "When 0 or 1 exceeds 10%",
        tradeValidity: 10,
        confidence: 92,
        signal: "STRONG",
        marketPower: 90,
        timestamp: Date.now(),
        patternStrength: 95,
      })
    }

    const digit8 = analysis.digitFrequencies[8]
    const digit9 = analysis.digitFrequencies[9]

    if (digit8.percentage < 10 && digit9.percentage < 10 && analysis.lowPercentage >= 90) {
      signals.push({
        id: `under8-${Date.now()}`,
        market: "All Volatilities",
        tradeType: "Under 8",
        entryPoint: "Wait for 1+ over digits",
        exitCondition: "When 8 or 9 exceeds 10%",
        tradeValidity: 10,
        confidence: 92,
        signal: "STRONG",
        marketPower: 90,
        timestamp: Date.now(),
        patternStrength: 95,
      })
    }

    if (analysis.evenPercentage >= 65) {
      const consecutiveOdds = countConsecutive(recentDigits, (d) => d % 2 === 1)
      if (consecutiveOdds >= 2) {
        signals.push({
          id: `even-${Date.now()}`,
          market: "All Volatilities",
          tradeType: "Even",
          entryPoint: "After first even digit appears",
          exitCondition: "When even percentage drops below 60%",
          tradeValidity: 5,
          confidence: analysis.evenPercentage,
          signal: consecutiveOdds >= 3 ? "STRONG" : "TRADE NOW",
          marketPower: analysis.evenPercentage - analysis.oddPercentage,
          timestamp: Date.now(),
          patternStrength: 80,
        })
      }
    }

    if (analysis.oddPercentage >= 70) {
      const consecutiveEvens = countConsecutive(recentDigits, (d) => d % 2 === 0)
      if (consecutiveEvens >= 2) {
        signals.push({
          id: `odd-${Date.now()}`,
          market: "All Volatilities",
          tradeType: "Odd",
          entryPoint: "After first odd digit appears",
          exitCondition: "When odd percentage drops below 65%",
          tradeValidity: 5,
          confidence: analysis.oddPercentage,
          signal: consecutiveEvens >= 3 ? "STRONG" : "TRADE NOW",
          marketPower: analysis.oddPercentage - analysis.evenPercentage,
          timestamp: Date.now(),
          patternStrength: 80,
        })
      }
    }

    const leastDigit = analysis.digitFrequencies.sort((a, b) => a.percentage - b.percentage)[0]
    if (leastDigit.percentage < 9) {
      signals.push({
        id: `differs-${Date.now()}`,
        market: "All Volatilities",
        tradeType: "Differs",
        entryPoint: `Digit ${leastDigit.digit}`,
        exitCondition: `When digit ${leastDigit.digit} exceeds 9%`,
        tradeValidity: 3,
        confidence: 100 - leastDigit.percentage,
        signal: leastDigit.percentage < 7 ? "STRONG" : "TRADE NOW",
        marketPower: 100 - leastDigit.percentage,
        timestamp: Date.now(),
        patternStrength: 88,
      })
    }

    if (recentDigits.length >= 5) {
      const last5 = recentDigits.slice(-5)
      const risingTrend = last5.every((d, i) => i === 0 || d >= last5[i - 1])
      const fallingTrend = last5.every((d, i) => i === 0 || d <= last5[i - 1])

      if (risingTrend) {
        signals.push({
          id: `rise-${Date.now()}`,
          market: "All Volatilities",
          tradeType: "Rise",
          entryPoint: "Immediate",
          exitCondition: "When trend reverses",
          tradeValidity: 3,
          confidence: 75,
          signal: "TRADE NOW",
          marketPower: 70,
          timestamp: Date.now(),
          patternStrength: 75,
        })
      }

      if (fallingTrend) {
        signals.push({
          id: `fall-${Date.now()}`,
          market: "All Volatilities",
          tradeType: "Fall",
          entryPoint: "Immediate",
          exitCondition: "When trend reverses",
          tradeValidity: 3,
          confidence: 75,
          signal: "TRADE NOW",
          marketPower: 70,
          timestamp: Date.now(),
          patternStrength: 75,
        })
      }
    }

    return signals.filter((s) => s.confidence >= 65).sort((a, b) => b.confidence - a.confidence)
  }

  const calculateTradeValidity = (percentage: number, recentDigits: number[]): number => {
    const volatility = calculateVolatility(recentDigits)
    const baseValidity = Math.floor(percentage / 10)
    return Math.max(3, Math.min(10, baseValidity - volatility))
  }

  const calculateVolatility = (digits: number[]): number => {
    if (digits.length < 2) return 0
    const changes = digits.slice(1).map((d, i) => Math.abs(d - digits[i]))
    return Math.floor(changes.reduce((sum, c) => sum + c, 0) / changes.length)
  }

  const calculatePatternStrength = (digits: number[], condition: (d: number) => boolean): number => {
    const matches = digits.filter(condition).length
    return Math.floor((matches / digits.length) * 100)
  }

  const countConsecutive = (digits: number[], condition: (d: number) => boolean): number => {
    let count = 0
    for (let i = digits.length - 1; i >= 0; i--) {
      if (condition(digits[i])) {
        count++
      } else {
        break
      }
    }
    return count
  }

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl p-6 border ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            : "bg-white/80 backdrop-blur-xl border-blue-200 shadow-[0_8px_32px_rgba(31,38,135,0.15)]"
        }`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2
            className={`text-2xl md:text-3xl font-bold ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"}`}
          >
            Super Signals
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogs(!showLogs)}
              className={
                theme === "dark"
                  ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  : "border-blue-300 text-blue-600 hover:bg-blue-50"
              }
            >
              <ScrollText className="h-4 w-4 mr-2" />
              {showLogs ? "Hide Logs" : "Show Logs"}
            </Button>
            <Badge className="bg-emerald-500 text-white text-sm px-4 py-2 animate-pulse flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Monitoring
            </Badge>
          </div>
        </div>

        <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
          Continuous real-time monitoring across all volatilities. Signals update automatically every 2 seconds based on
          market conditions, pattern strength, and trade validity.
        </p>

        {showLogs && (
          <div
            className={`mb-6 rounded-lg p-4 border ${theme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"} max-h-48 overflow-y-auto`}
          >
            <h3 className={`text-sm font-bold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
              Scan Logs
            </h3>
            <div className="space-y-1">
              {scanLogs.length === 0 ? (
                <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>No logs yet...</p>
              ) : (
                scanLogs.map((log, index) => (
                  <p
                    key={index}
                    className={`text-xs font-mono ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}
                  >
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        )}

        {superSignals.length === 0 ? (
          <div className="text-center py-12">
            <Zap className={`h-16 w-16 mx-auto mb-4 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
              Scanning for optimal trading opportunities...
            </p>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
              Signals will appear when conditions are met
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {superSignals.map((signal) => (
              <Card
                key={signal.id}
                className={`p-4 border-2 ${
                  signal.signal === "STRONG"
                    ? theme === "dark"
                      ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-[0_8px_24px_rgba(16,185,129,0.2)]"
                    : signal.signal === "WAIT"
                      ? theme === "dark"
                        ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse-slow"
                        : "border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-[0_8px_24px_rgba(59,130,246,0.2)] animate-pulse-slow"
                      : theme === "dark"
                        ? "border-gray-500/50 bg-gray-500/10"
                        : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {signal.tradeType}
                    </h3>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {signal.market} - Volatility 100 Index
                    </p>
                  </div>
                  <Badge
                    className={`${
                      signal.signal === "STRONG"
                        ? theme === "dark"
                          ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse"
                          : "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]"
                        : signal.signal === "WAIT"
                          ? theme === "dark"
                            ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse-slow"
                            : "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-[0_4px_16px_rgba(59,130,246,0.4)]"
                          : theme === "dark"
                            ? "bg-gray-600 text-white"
                            : "bg-gray-400 text-white"
                    }`}
                  >
                    {signal.signal}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Entry Point:</span>
                    <span className={`font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                      {signal.entryPoint}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Confidence:</span>
                    <span className={`font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                      {signal.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Trade Validity:</span>
                    <span className={`font-bold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
                      {signal.tradeValidity} ticks
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Market Power:</span>
                    <span className={`font-bold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>
                      {signal.marketPower.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Pattern Strength:</span>
                    <span className={`font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                      {signal.patternStrength}%
                    </span>
                  </div>
                </div>

                <div
                  className={`text-xs p-2 rounded ${theme === "dark" ? "bg-blue-500/10 text-gray-300" : "bg-blue-50 text-gray-700"}`}
                >
                  <strong>Exit:</strong> {signal.exitCondition}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
