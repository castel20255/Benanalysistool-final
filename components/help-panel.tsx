"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageCircle } from "lucide-react"

export function HelpPanel() {
  const openWhatsApp = () => {
    window.open("https://wa.me/254757722344", "_blank")
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">Signal Types & Entry Rules</CardTitle>
          <CardDescription>Understanding different trading signals</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="even-odd" className="border-blue-500/20">
              <AccordionTrigger className="text-white hover:text-cyan-400">Even/Odd Signals</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <p className="mb-2">
                  <strong className="text-white">Entry Rule:</strong> Wait for 2+ consecutive opposite digits, then
                  trade the favored direction.
                </p>
                <p>
                  <strong className="text-white">Example:</strong> If Even is at 60%, wait for 2+ Odd digits, then trade
                  Even.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="over-under" className="border-blue-500/20">
              <AccordionTrigger className="text-white hover:text-cyan-400">Over/Under Signals</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <p className="mb-2">
                  <strong className="text-white">Entry Rule:</strong> Trade when the strongest digit appears and
                  over/under bias is strong (62%+).
                </p>
                <p>
                  <strong className="text-white">Example:</strong> If Over 4.5 is at 65% and digit 7 is strongest, trade
                  Over when 7 appears.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="matches" className="border-blue-500/20">
              <AccordionTrigger className="text-white hover:text-cyan-400">Matches Signals</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <p className="mb-2">
                  <strong className="text-white">Entry Rule:</strong> Trade immediately when the most frequent digit
                  appears (15%+ frequency).
                </p>
                <p>
                  <strong className="text-white">Example:</strong> If digit 3 appears 18% of the time, trade Matches 3
                  when it appears.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="differs" className="border-blue-500/20">
              <AccordionTrigger className="text-white hover:text-cyan-400">Differs Signals</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <p className="mb-2">
                  <strong className="text-white">Entry Rule:</strong> Wait for the least frequent digit to appear
                  (&lt;9%), then trade Differs immediately.
                </p>
                <p>
                  <strong className="text-white">Example:</strong> If digit 5 appears only 6% of the time, trade Differs
                  5 when it appears.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rise-fall" className="border-blue-500/20">
              <AccordionTrigger className="text-white hover:text-cyan-400">Rise/Fall Signals</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <p className="mb-2">
                  <strong className="text-white">Entry Rule:</strong> Trade based on Bollinger Bands & CCI indicators
                  with 60%+ confidence.
                </p>
                <p>
                  <strong className="text-white">Example:</strong> If price is trending up with 65% confidence, trade
                  Rise.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">Strategies</CardTitle>
          <CardDescription>Pro trading strategies for higher win rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-400">
          <div>
            <h4 className="text-white font-semibold mb-2">Pro Even/Odd Strategy</h4>
            <p className="text-sm">
              Requires 55%+ Even (or 70%+ Odd) with 2+ high-percentage digits. Wait for 3+ consecutive opposite digits
              before entering.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Pro Over/Under Strategy</h4>
            <p className="text-sm">
              Over 1: Requires digits 0 and 1 &lt;10%, with 90%+ Over rate. Under 8: Requires digits 8 and 9 &lt;10%,
              with 90%+ Under rate.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Pro Differs Strategy</h4>
            <p className="text-sm">
              Target digits with &lt;9% frequency for 88%+ win rate. Wait for the target digit to appear, then trade
              Differs immediately.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">About This Application</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400 space-y-3">
          <p>
            Bena Analysis Tool is a real-time market analysis platform for Deriv trading. It provides advanced
            statistical analysis and trading signals based on digit patterns and market trends.
          </p>
          <p className="text-sm">
            <strong className="text-white">Disclaimer:</strong> This tool is for educational purposes only. Trading
            involves risk, and past performance does not guarantee future results.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">Contact & Support</CardTitle>
          <CardDescription>Get in touch with us</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-white">
            <Phone className="h-5 w-5 text-green-400" />
            <span>+254757722344</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Mail className="h-5 w-5 text-blue-400" />
            <span>mbuguabenson2020@gmail.com</span>
          </div>
          <Button onClick={openWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat on WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
