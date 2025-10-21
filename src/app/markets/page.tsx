"use client"

import { useState } from "react"
import { Layout } from "@/components"
import {
    TickerTape,
    MarketOverview,
    Hotlists,
    AdvancedChart,
    SymbolInfo,
    TechnicalAnalysis,
    Financials,
    CompanyProfile,
    SymbolSearch
} from "@/components/tw"

export default function MarketsPage() {
    const [activeView, setActiveView] = useState<"overview" | "chart" | "hotlists" | "search">("overview")
    const [selectedSymbol, setSelectedSymbol] = useState<string>("NASDAQ:AAPL")

    const handleSymbolSelect = (symbol: string) => {
        setSelectedSymbol(symbol)
        setActiveView("search")
    }

    return (
        <Layout
            maxWidth="max-w-full"
            padding={{
                left: "lg:ml-60",
                right: "",
                top: "pt-0",
                bottom: "pb-32 lg:pb-0"
            }}
        >
            {/* TradingView Ticker Tape - 全幅 */}
            <div className="border-b border-border">
                <TickerTape
                    colorTheme="dark"
                    displayMode="adaptive"
                />
            </div>

            {/* Header + View Switcher */}
            <div className="border-b border-border">
                <div className="px-8 py-6">
                    <h1 className="text-[32px] font-bold tracking-tight text-foreground mb-2">
                        Markets
                    </h1>

                    {/* View Tabs */}
                    <div className="flex gap-1 border-b border-border -mb-6">
                        <button
                            onClick={() => setActiveView("overview")}
                            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                activeView === "overview"
                                    ? "text-foreground border-[rgb(var(--accent))]"
                                    : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                            }`}
                        >
                            Market Overview
                        </button>
                        <button
                            onClick={() => setActiveView("chart")}
                            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                activeView === "chart"
                                    ? "text-foreground border-[rgb(var(--accent))]"
                                    : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                            }`}
                        >
                            Advanced Chart
                        </button>
                        <button
                            onClick={() => setActiveView("hotlists")}
                            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                activeView === "hotlists"
                                    ? "text-foreground border-[rgb(var(--accent))]"
                                    : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                            }`}
                        >
                            Top Movers
                        </button>
                        <button
                            onClick={() => setActiveView("search")}
                            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                activeView === "search"
                                    ? "text-foreground border-[rgb(var(--accent))]"
                                    : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                            }`}
                        >
                            Symbol Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-8 py-8">
                {/* Market Overview */}
                {activeView === "overview" && (
                    <div>
                        <div className="mb-4">
                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                Indices • Crypto • Forex • Commodities in one view
                            </p>
                        </div>
                        <MarketOverview
                            colorTheme="dark"
                            dateRange="12M"
                            showChart={true}
                            showSymbolLogo={true}
                            height={700}
                        />
                    </div>
                )}

                {/* Advanced Chart */}
                {activeView === "chart" && (
                    <div>
                        <div className="mb-4">
                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                Professional charting tools with technical indicators
                            </p>
                        </div>
                        <div style={{ height: "calc(100vh - 350px)", minHeight: "600px" }}>
                            <AdvancedChart
                                symbol={selectedSymbol}
                                theme="dark"
                                interval="D"
                                allowSymbolChange={true}
                                hideSideToolbar={false}
                                hideTopToolbar={false}
                                autosize={true}
                            />
                        </div>
                    </div>
                )}

                {/* Top Movers */}
                {activeView === "hotlists" && (
                    <div>
                        <div className="mb-4">
                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                Real-time top gainers, losers and most active stocks
                            </p>
                        </div>

                        {/* Single Hotlist - Full Width */}
                        <Hotlists
                            exchange="US"
                            colorTheme="dark"
                            dateRange="1D"
                            showChart={true}
                            height={700}
                        />
                    </div>
                )}

                {/* Symbol Search & Analysis */}
                {activeView === "search" && (
                    <div>
                        <div className="mb-6">
                            <p className="text-xs text-[rgb(var(--foreground-tertiary))] mb-4">
                                Search symbols and view comprehensive analysis
                            </p>

                            {/* Search Bar */}
                            <div className="flex gap-4 items-center mb-6">
                                <div className="flex-1 max-w-md">
                                    <SymbolSearch
                                        onSymbolSelect={setSelectedSymbol}
                                        theme="dark"
                                        width="100%"
                                        height={40}
                                    />
                                </div>
                                <div className="text-sm text-[rgb(var(--foreground-secondary))]">
                                    Current: <span className="font-mono text-[rgb(var(--accent))]">{selectedSymbol}</span>
                                </div>
                            </div>
                        </div>

                        {/* Symbol Analysis Dashboard */}
                        <div className="space-y-8">
                            {/* Row 1: Basic Info & Chart */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Symbol Info */}
                                <div className="lg:col-span-1">
                                    <div className="mb-4 pb-3 border-b border-border">
                                        <h3 className="text-sm font-semibold text-foreground">Symbol Information</h3>
                                        <p className="text-xs text-[rgb(var(--foreground-tertiary))] mt-1">
                                            Real-time price and stats
                                        </p>
                                    </div>
                                    <SymbolInfo
                                        symbol={selectedSymbol}
                                        colorTheme="dark"
                                        width="100%"
                                    />
                                </div>

                                {/* Mini Chart */}
                                <div className="lg:col-span-2">
                                    <div className="mb-4 pb-3 border-b border-border">
                                        <h3 className="text-sm font-semibold text-foreground">Price Chart</h3>
                                        <p className="text-xs text-[rgb(var(--foreground-tertiary))] mt-1">
                                            Interactive price history
                                        </p>
                                    </div>
                                    <div style={{ height: "400px" }}>
                                        <AdvancedChart
                                            symbol={selectedSymbol}
                                            theme="dark"
                                            interval="D"
                                            allowSymbolChange={false}
                                            hideSideToolbar={true}
                                            hideTopToolbar={true}
                                            autosize={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Technical & Fundamental Analysis */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {/* Technical Analysis */}
                                <div>
                                    <div className="mb-4 pb-3 border-b border-border">
                                        <h3 className="text-sm font-semibold text-foreground">Technical Analysis</h3>
                                        <p className="text-xs text-[rgb(var(--foreground-tertiary))] mt-1">
                                            Buy/Sell signals & indicators
                                        </p>
                                    </div>
                                    <TechnicalAnalysis
                                        symbol={selectedSymbol}
                                        colorTheme="dark"
                                        interval="1D"
                                        width="100%"
                                        height={450}
                                    />
                                </div>

                                {/* Financials (for stocks) */}
                                <div>
                                    <div className="mb-4 pb-3 border-b border-border">
                                        <h3 className="text-sm font-semibold text-foreground">Fundamentals</h3>
                                        <p className="text-xs text-[rgb(var(--foreground-tertiary))] mt-1">
                                            Financial metrics & ratios
                                        </p>
                                    </div>
                                    <Financials
                                        symbol={selectedSymbol}
                                        colorTheme="dark"
                                        displayMode="regular"
                                        width="100%"
                                        height={450}
                                    />
                                </div>

                                {/* Company Profile */}
                                <div>
                                    <div className="mb-4 pb-3 border-b border-border">
                                        <h3 className="text-sm font-semibold text-foreground">Company Profile</h3>
                                        <p className="text-xs text-[rgb(var(--foreground-tertiary))] mt-1">
                                            Business overview & details
                                        </p>
                                    </div>
                                    <CompanyProfile
                                        symbol={selectedSymbol}
                                        colorTheme="dark"
                                        width="100%"
                                        height={450}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-border">
                <p className="text-xs text-[rgb(var(--foreground-tertiary))] font-mono">
                    Market data provided by TradingView
                </p>
            </div>
        </Layout>
    )
}