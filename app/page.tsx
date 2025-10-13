"use client"

import { useState, useEffect } from "react"
import { useDeriv } from "@/hooks/use-deriv"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Home } from "lucide-react"
import { MarketSelector } from "@/components/market-selector"
import { DigitDistribution } from "@/components/digit-distribution"
import { ConnectionLogs } from "@/components/connection-logs"
import { SettingsPanel } from "@/components/settings-panel"
import { HelpPanel } from "@/components/help-panel"
import { SignalsTab } from "@/components/tabs/signals-tab"
import { ProSignalsTab } from "@/components/tabs/pro-signals-tab"
import { EvenOddTab } from "@/components/tabs/even-odd-tab"
import { OverUnderTab } from "@/components/tabs/over-under-tab"
import { MatchesTab } from "@/components/tabs/matches-tab"
import { DiffersTab } from "@/components/tabs/differs-tab"
import { RiseFallTab } from "@/components/tabs/rise-fall-tab"
import { TradingViewTab } from "@/components/tabs/trading-view-tab"
import { StatisticalAnalysis } from "@/components/statistical-analysis"
import { LastDigitsChart } from "@/components/charts/last-digits-chart"
import { LastDigitsLineChart } from "@/components/charts/last-digits-line-chart"
import { AIAnalysisTab } from "@/components/tabs/ai-analysis-tab"
import { BotTab } from "@/components/tabs/bot-tab"
import { SuperSignalsTab } from "@/components/tabs/super-signals-tab"
import { LoadingScreen } from "@/components/loading-screen"

export default function DerivAnalysisApp() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isLoading, setIsLoading] = useState(true)
  const {
    connectionStatus,
    currentPrice,
    currentDigit,
    tickCount,
    analysis,
    signals,
    proSignals,
    symbol,
    maxTicks,
    availableSymbols,
    connectionLogs,
    changeSymbol,
    changeMaxTicks,
    getRecentDigits,
  } = useDeriv()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  const recentDigits = getRecentDigits(20)
  const recent40Digits = getRecentDigits(40)
  const recent50Digits = getRecentDigits(50)
  const recent100Digits = getRecentDigits(100)

  const activeSignals = (signals || []).filter((s) => s.status !== "NEUTRAL")
  const powerfulSignalsCount = activeSignals.filter((s) => s.status === "TRADE NOW").length

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#1a1f3a]" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}
    >
      <header
        className={`border-b ${theme === "dark" ? "border-blue-500/20 bg-[#0a0e27]/80" : "border-gray-200 bg-white/80"} backdrop-blur-md sticky top-0 z-50`}
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className={
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                }
              >
                <Home className="h-5 w-5" />
              </Button>
              <h1
                className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === "dark" ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" : "text-gray-900"}`}
              >
                Bena Analysis Tool
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {availableSymbols.length > 0 && (
                <MarketSelector
                  symbols={availableSymbols}
                  currentSymbol={symbol}
                  onSymbolChange={changeSymbol}
                  theme={theme}
                />
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Ticks:</span>
                <Select value={maxTicks.toString()} onValueChange={(v) => changeMaxTicks(Number.parseInt(v))}>
                  <SelectTrigger
                    className={`w-28 sm:w-32 text-sm ${theme === "dark" ? "bg-[#0f1629]/50 border-blue-500/30 text-white hover:bg-[#1a2235]" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className={theme === "dark" ? "bg-[#0a0e27] border-blue-500/30" : "bg-white border-gray-300"}
                  >
                    <SelectItem value="25">25 ticks</SelectItem>
                    <SelectItem value="50">50 ticks</SelectItem>
                    <SelectItem value="100">100 ticks</SelectItem>
                    <SelectItem value="150">150 ticks</SelectItem>
                    <SelectItem value="200">200 ticks</SelectItem>
                    <SelectItem value="300">300 ticks</SelectItem>
                    <SelectItem value="500">500 ticks</SelectItem>
                    <SelectItem value="1000">1000 ticks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>

              <div
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border ${theme === "dark" ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"}`}
              >
                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Price:</span>
                <span className={`font-bold text-lg sm:text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {currentPrice?.toFixed(5) || "---"}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${theme === "dark" ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"}`}
              >
                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Digit:</span>
                {currentDigit !== null ? (
                  <span className={`text-base font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                    {currentDigit}
                  </span>
                ) : (
                  <span className={`text-base font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                    0
                  </span>
                )}
              </div>

              {connectionStatus === "connected" ? (
                <Badge
                  className={
                    theme === "dark"
                      ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)] text-sm"
                      : "bg-green-100 text-green-700 border-green-300 text-sm"
                  }
                >
                  Connected
                </Badge>
              ) : connectionStatus === "reconnecting" ? (
                <Badge
                  variant="outline"
                  className={
                    theme === "dark"
                      ? "border-orange-500 text-orange-400 bg-orange-500/10 text-sm"
                      : "border-orange-400 text-orange-600 bg-orange-50 text-sm"
                  }
                >
                  Reconnecting
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className={
                    theme === "dark"
                      ? "border-red-500 text-red-400 bg-red-500/10 text-sm"
                      : "border-red-400 text-red-600 bg-red-50 text-sm"
                  }
                >
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="smart-analysis" className="w-full">
        <div
          className={`border-b ${theme === "dark" ? "border-blue-500/20 bg-[#0a0e27]/60" : "border-gray-200 bg-white/60"} backdrop-blur-sm sticky top-[73px] sm:top-[81px] z-40`}
        >
          <div className="container mx-auto px-2 sm:px-4">
            <TabsList className="w-full justify-start bg-transparent border-0 h-auto p-0 gap-0 overflow-x-auto flex-wrap scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
              {[
                "smart-analysis",
                "signals",
                "pro-signals",
                "super-signals",
                "even-odd",
                "over-under",
                "matches",
                "differs",
                "rise-fall",
                "ai-analysis",
                "bot",
                "trading-view",
                "settings",
                "logs",
                "help",
              ].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={`flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_2px_10px_rgba(34,211,238,0.3)] px-3 sm:px-4 md:px-6 py-3 text-sm ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} whitespace-nowrap transition-all capitalize font-medium`}
                >
                  {tab.replace(/-/g, " ")}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {connectionStatus !== "connected" ? (
            <div className="text-center py-16 sm:py-32">
              <h2
                className={`text-2xl sm:text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Connect to View Analysis
              </h2>
              <p className={`text-base sm:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Connecting to Deriv API for {symbol}...
              </p>
            </div>
          ) : (
            <>
              <TabsContent value="smart-analysis" className="mt-0 space-y-4 sm:space-y-6">
                <div
                  className={`rounded-xl p-4 sm:p-6 border text-center ${theme === "dark" ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                >
                  <div className={`text-xs sm:text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Current Digit:
                  </div>
                  {currentDigit !== null ? (
                    <div
                      className={`text-4xl sm:text-6xl font-bold animate-pulse ${theme === "dark" ? "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent" : "text-orange-600"}`}
                    >
                      {currentDigit}
                    </div>
                  ) : (
                    <div
                      className={`text-4xl sm:text-6xl font-bold animate-pulse ${theme === "dark" ? "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent" : "text-orange-600"}`}
                    >
                      0
                    </div>
                  )}
                  <div
                    className={`text-base sm:text-xl mt-4 font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Price: {currentPrice?.toFixed(5) || "---"}
                  </div>
                </div>

                {analysis && analysis.digitFrequencies && (
                  <div
                    className={`rounded-xl p-4 sm:p-8 border ${theme === "dark" ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                  >
                    <h3
                      className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Digits Distribution
                    </h3>
                    <DigitDistribution
                      frequencies={analysis.digitFrequencies}
                      currentDigit={currentDigit}
                      theme={theme}
                    />
                  </div>
                )}

                {analysis && recent100Digits.length > 0 && recentDigits.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div
                      className={`rounded-xl p-4 sm:p-6 border ${theme === "dark" ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                    >
                      <h3
                        className={`text-base sm:text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Last Digits Line Chart
                      </h3>
                      <LastDigitsLineChart digits={recentDigits.slice(-10)} />
                    </div>

                    <div
                      className={`rounded-xl p-4 sm:p-6 border ${theme === "dark" ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                    >
                      <StatisticalAnalysis analysis={analysis} recentDigits={recent100Digits} theme={theme} />
                    </div>
                  </div>
                )}

                {recentDigits.length > 0 && (
                  <div
                    className={`rounded-xl p-4 sm:p-6 border ${theme === "dark" ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                  >
                    <h3
                      className={`text-base sm:text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Last 20 Digits Chart
                    </h3>
                    <LastDigitsChart digits={recentDigits} />
                  </div>
                )}

                {analysis && analysis.digitFrequencies && analysis.powerIndex && (
                  <div
                    className={`rounded-xl p-4 sm:p-6 border ${theme === "dark" ? "bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                  >
                    <h3
                      className={`text-base sm:text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Frequency Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`text-center rounded-lg p-3 border ${theme === "dark" ? "bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "bg-green-50 border-green-200"}`}
                      >
                        <div
                          className={`text-xs sm:text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Most Frequent
                        </div>
                        <div
                          className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                        >
                          {analysis.powerIndex.strongest}
                        </div>
                        <div
                          className={`mt-1 text-sm sm:text-base font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                        >
                          {analysis.digitFrequencies[analysis.powerIndex.strongest]?.percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div
                        className={`text-center rounded-lg p-3 border ${theme === "dark" ? "bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-red-50 border-red-200"}`}
                      >
                        <div
                          className={`text-xs sm:text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Least Frequent
                        </div>
                        <div
                          className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                        >
                          {analysis.powerIndex.weakest}
                        </div>
                        <div
                          className={`mt-1 text-sm sm:text-base font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                        >
                          {analysis.digitFrequencies[analysis.powerIndex.weakest]?.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {analysis && (
                  <div
                    className={`rounded-xl p-4 sm:p-6 border ${theme === "dark" ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]" : "bg-purple-50 border-purple-200 shadow-lg"}`}
                  >
                    <h3
                      className={`text-base sm:text-lg font-bold mb-4 ${theme === "dark" ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" : "text-purple-900"}`}
                    >
                      Analysis Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`text-center p-4 rounded-lg ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"}`}
                      >
                        <div
                          className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                        >
                          {analysis.totalTicks || 0}
                        </div>
                        <div className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Total Ticks
                        </div>
                      </div>
                      <div
                        className={`text-center p-4 rounded-lg ${theme === "dark" ? "bg-green-500/10" : "bg-green-50"}`}
                      >
                        <div
                          className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                        >
                          {powerfulSignalsCount}
                        </div>
                        <div className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Powerful Signals
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signals" className="mt-0">
                {analysis && <SignalsTab signals={signals} proSignals={proSignals} analysis={analysis} theme={theme} />}
              </TabsContent>

              <TabsContent value="pro-signals" className="mt-0">
                {analysis && <ProSignalsTab proSignals={proSignals} analysis={analysis} theme={theme} />}
              </TabsContent>

              <TabsContent value="super-signals" className="mt-0">
                {analysis && (
                  <SuperSignalsTab
                    analysis={analysis}
                    currentDigit={currentDigit}
                    recentDigits={recent100Digits}
                    theme={theme}
                  />
                )}
              </TabsContent>

              <TabsContent value="even-odd" className="mt-0">
                {analysis && (
                  <EvenOddTab
                    analysis={analysis}
                    signals={signals}
                    currentDigit={currentDigit}
                    currentPrice={currentPrice}
                    recentDigits={recent40Digits}
                    theme={theme}
                  />
                )}
              </TabsContent>

              <TabsContent value="over-under" className="mt-0">
                {analysis && (
                  <OverUnderTab
                    analysis={analysis}
                    signals={signals}
                    currentDigit={currentDigit}
                    currentPrice={currentPrice}
                    recentDigits={recent50Digits}
                    theme={theme}
                  />
                )}
              </TabsContent>

              <TabsContent value="matches" className="mt-0">
                {analysis && (
                  <MatchesTab analysis={analysis} signals={signals} recentDigits={recentDigits} theme={theme} />
                )}
              </TabsContent>

              <TabsContent value="differs" className="mt-0">
                {analysis && (
                  <DiffersTab analysis={analysis} signals={signals} recentDigits={recentDigits} theme={theme} />
                )}
              </TabsContent>

              <TabsContent value="rise-fall" className="mt-0">
                {analysis && (
                  <RiseFallTab
                    analysis={analysis}
                    signals={signals}
                    currentPrice={currentPrice}
                    recentDigits={recent40Digits}
                    theme={theme}
                  />
                )}
              </TabsContent>

              <TabsContent value="ai-analysis" className="mt-0">
                {analysis && (
                  <AIAnalysisTab
                    analysis={analysis}
                    currentDigit={currentDigit}
                    currentPrice={currentPrice}
                    symbol={symbol}
                    theme={theme}
                  />
                )}
              </TabsContent>

              <TabsContent value="bot" className="mt-0">
                <BotTab theme={theme} />
              </TabsContent>

              <TabsContent value="trading-view" className="mt-0">
                <TradingViewTab theme={theme} />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsPanel />
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                <ConnectionLogs logs={connectionLogs} />
              </TabsContent>

              <TabsContent value="help" className="mt-0">
                <HelpPanel />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>

      <a
        href="https://wa.me/254757722344"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          theme === "dark"
            ? "bg-[#25D366] shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]"
            : "bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.37)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
        }`}
      >
        <svg
          className={`w-8 h-8 sm:w-10 sm:h-10 ${theme === "dark" ? "text-white" : "text-[#25D366]"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 6.988 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <footer
        className={`border-t ${theme === "dark" ? "border-blue-500/20 bg-[#0a0e27]/80" : "border-gray-200 bg-white/80"} backdrop-blur-md mt-8`}
      >
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center md:text-left">
              <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Bena Analysis Tool
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Advanced trading analysis for Deriv markets
              </p>
            </div>
            <div className="text-center">
              <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Contact Us
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Email: mbuguabenson2020@gmail.com
              </p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                WhatsApp: +254757722344
              </p>
            </div>
            <div className="text-center md:text-right">
              <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Follow Us
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Twitter | Telegram</p>
            </div>
          </div>
          <div
            className="text-center border-t pt-4"
            style={{ borderColor: theme === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(229, 231, 235, 1)" }}
          >
            <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              © 2025 Bena Analysis Tool. All rights reserved.
            </p>
            <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
              Trading involves risk. Use signals responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
