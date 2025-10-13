"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { DerivWebSocket, type DerivSymbol, type ConnectionLog } from "@/lib/deriv-websocket"
import { AnalysisEngine, type TickData, type AnalysisResult, type Signal } from "@/lib/analysis-engine"
import { AIPredictor, type PredictionResult } from "@/lib/ai-predictor"

export function useDeriv(initialSymbol = "R_100", initialMaxTicks = 100) {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">(
    "disconnected",
  )
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [currentDigit, setCurrentDigit] = useState<number | null>(null)
  const [tickCount, setTickCount] = useState(0)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [aiPrediction, setAiPrediction] = useState<PredictionResult | null>(null)
  const [symbol, setSymbol] = useState(initialSymbol)
  const [maxTicks, setMaxTicks] = useState(initialMaxTicks)
  const [availableSymbols, setAvailableSymbols] = useState<DerivSymbol[]>([])
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([])
  const [proSignals, setProSignals] = useState<Signal[]>([])

  const wsRef = useRef<DerivWebSocket | null>(null)
  const engineRef = useRef<AnalysisEngine | null>(null)
  const predictorRef = useRef<AIPredictor | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    wsRef.current = new DerivWebSocket()
    engineRef.current = new AnalysisEngine(maxTicks)
    predictorRef.current = new AIPredictor()

    const unsubscribeStatus = wsRef.current.onConnectionStatus((status) => {
      setConnectionStatus(status)
    })

    const unsubscribeTick = wsRef.current.subscribe("tick", (data) => {
      if (data.tick) {
        const tick: TickData = {
          epoch: data.tick.epoch,
          quote: data.tick.quote,
          symbol: data.tick.symbol,
          pipSize: data.tick.pip_size || 2,
        }

        if (data.tick.pip_size) {
          engineRef.current?.setPipSize(data.tick.pip_size)
        }

        engineRef.current?.addTick(tick)

        setCurrentPrice(tick.quote)
        setCurrentDigit(engineRef.current?.getCurrentDigit() || null)
        setTickCount((prev) => prev + 1)

        const newAnalysis = engineRef.current?.getAnalysis()
        const newSignals = engineRef.current?.generateSignals()
        const newProSignals = engineRef.current?.generateProSignals()

        if (newAnalysis) setAnalysis(newAnalysis)
        if (newSignals) setSignals(newSignals)
        if (newProSignals) setProSignals(newProSignals)

        if (predictorRef.current && engineRef.current) {
          const lastDigits = engineRef.current.getLastDigits()
          const digitCounts = new Map<number, number>()
          newAnalysis?.digitFrequencies.forEach((freq) => {
            digitCounts.set(freq.digit, freq.count)
          })
          const prediction = predictorRef.current.predict(lastDigits, digitCounts)
          setAiPrediction(prediction)
        }
      }
    })

    const unsubscribeSymbols = wsRef.current.subscribe("active_symbols", (data) => {
      if (data.active_symbols) {
        setAvailableSymbols(data.active_symbols)
      }
    })

    const unsubscribeLogs = wsRef.current.subscribe("connection_log", (log: ConnectionLog) => {
      setConnectionLogs((prev) => [...prev, log].slice(-100))
    })

    wsRef.current.connect().then(() => {
      wsRef.current?.getActiveSymbols()
      wsRef.current?.subscribeTicks(symbol)
    })

    return () => {
      unsubscribeStatus()
      unsubscribeTick()
      unsubscribeSymbols()
      unsubscribeLogs()
      wsRef.current?.disconnect()
    }
  }, [])

  const changeSymbol = useCallback((newSymbol: string) => {
    if (wsRef.current?.isConnected()) {
      wsRef.current.unsubscribeTicks()
      wsRef.current.subscribeTicks(newSymbol)
      engineRef.current?.clear()
      setSymbol(newSymbol)
      setTickCount(0)
      setCurrentPrice(null)
      setCurrentDigit(null)
      setAnalysis(null)
      setSignals([])
      setAiPrediction(null)
    }
  }, [])

  const changeMaxTicks = useCallback((newMaxTicks: number) => {
    engineRef.current?.setMaxTicks(newMaxTicks)
    setMaxTicks(newMaxTicks)
  }, [])

  const exportData = useCallback(
    (format: "csv" | "json") => {
      const ticks = engineRef.current?.getTicks() || []
      const analysisData = engineRef.current?.getAnalysis()

      if (format === "json") {
        return JSON.stringify({ ticks, analysis: analysisData, signals }, null, 2)
      } else {
        let csv = "Epoch,Quote,Symbol,LastDigit\n"
        const lastDigits = engineRef.current?.getLastDigits() || []
        ticks.forEach((tick, index) => {
          csv += `${tick.epoch},${tick.quote},${tick.symbol},${lastDigits[index]}\n`
        })
        return csv
      }
    },
    [signals],
  )

  const getRecentDigits = useCallback((count = 20) => {
    return engineRef.current?.getRecentDigits(count) || []
  }, [])

  return {
    connectionStatus,
    currentPrice,
    currentDigit,
    tickCount,
    analysis,
    signals: signals || [],
    proSignals: proSignals || [],
    aiPrediction,
    symbol,
    maxTicks,
    availableSymbols,
    connectionLogs,
    changeSymbol,
    changeMaxTicks,
    exportData,
    getRecentDigits,
  }
}
