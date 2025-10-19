"use client"

import { TrendingUp, Home, Activity, BarChart3, Settings, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default function PortfolioPage() {
    const navigation = [
        { name: "Overview", icon: Home, href: "/", active: false },
        { name: "Transactions", icon: Activity, href: "/transactions", active: false },
        { name: "Portfolio", icon: TrendingUp, href: "/portfolio", active: true },
        { name: "Analytics", icon: BarChart3, href: "/analytics", active: false },
        { name: "Settings", icon: Settings, href: "/settings", active: false },
    ]

    const portfolio = [
        {
            symbol: "BTC",
            name: "Bitcoin",
            value: 2847293,
            change: 2.34,
            change24h: 1.2,
            amount: "0.5234 BTC",
            avgCost: 5200000,
            totalCost: 2721680,
        },
        {
            symbol: "AAPL",
            name: "Apple Inc.",
            value: 3284750,
            change: -0.87,
            change24h: -0.3,
            amount: "150 shares",
            avgCost: 21500,
            totalCost: 3225000,
        },
        {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            value: 2847293,
            change: 1.45,
            change24h: 0.8,
            amount: "75 shares",
            avgCost: 37200,
            totalCost: 2790000,
        },
        {
            symbol: "ETH",
            name: "Ethereum",
            value: 1284750,
            change: 3.21,
            change24h: 2.1,
            amount: "3.2847 ETH",
            avgCost: 380000,
            totalCost: 1248186,
        },
        {
            symbol: "TSLA",
            name: "Tesla Inc.",
            value: 1847293,
            change: -2.15,
            change24h: -1.5,
            amount: "50 shares",
            avgCost: 38500,
            totalCost: 1925000,
        },
        {
            symbol: "MSFT",
            name: "Microsoft Corp.",
            value: 2184750,
            change: 0.92,
            change24h: 0.4,
            amount: "100 shares",
            avgCost: 21500,
            totalCost: 2150000,
        },
    ]

    const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0)
    const totalCost = portfolio.reduce((sum, item) => sum + item.totalCost, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = ((totalGainLoss / totalCost) * 100).toFixed(2)

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col border-r border-border bg-background">
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-2.5 mb-12">
                        <TrendingUp className="h-6 w-6 text-[rgb(var(--accent))]" strokeWidth={2.5} />
                        <span className="text-[17px] font-semibold tracking-tight text-foreground">Future</span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-subhead font-medium transition-colors ${
                                    item.active
                                        ? "bg-[rgb(var(--accent))] text-white"
                                        : "text-[rgb(var(--foreground-secondary))] hover:bg-white/5 hover:text-foreground"
                                }`}
                            >
                                <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-border pt-6">
                        <div className="flex items-center gap-3 px-3">
                            <div className="h-8 w-8 rounded-full bg-[rgb(var(--accent))]/10 flex items-center justify-center flex-shrink-0 ring-1 ring-[rgb(var(--accent))]/20">
                                <span className="text-caption font-semibold text-[rgb(var(--accent))]">JD</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-subhead font-medium text-foreground">John Doe</p>
                                <p className="text-caption text-[rgb(var(--foreground-tertiary))]">john@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-border">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[rgb(var(--accent))]" strokeWidth={2.5} />
                        <span className="text-callout font-semibold text-foreground">Future</span>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="lg:ml-60 lg:pl-16 px-6 lg:pr-16 py-12 pb-32 lg:pb-16">
                <div className="max-w-[1400px]">
                    {/* Portfolio Summary */}
                    <div className="mb-12">
                        <h1 className="text-display mb-12 text-foreground">Portfolio</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-2">Total Value</p>
                                <p className="text-[32px] font-bold tabular text-foreground leading-none">
                                    ¥{totalValue.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-2">Total Cost</p>
                                <p className="text-[32px] font-bold tabular text-foreground leading-none">
                                    ¥{totalCost.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-2">Total Gain/Loss</p>
                                <p
                                    className={`text-[32px] font-bold tabular leading-none ${
                                        totalGainLoss >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                                    }`}
                                >
                                    {totalGainLoss >= 0 ? "+" : ""}¥{totalGainLoss.toLocaleString()}
                                </p>
                                <p
                                    className={`text-footnote font-medium mt-2 ${
                                        totalGainLoss >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                                    }`}
                                >
                                    {totalGainLoss >= 0 ? "+" : ""}
                                    {totalGainLossPercent}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Holdings */}
                    <div className="border-t border-border">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 py-4 px-4 border-b border-border/50">
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider">
                                Asset
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                Holdings
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                Value
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                Cost
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                P&L
                            </p>
                        </div>

                        {portfolio.map((item) => {
                            const gainLoss = item.value - item.totalCost
                            const gainLossPercent = ((gainLoss / item.totalCost) * 100).toFixed(2)

                            return (
                                <div
                                    key={item.symbol}
                                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 py-5 px-4 border-b border-border/30 hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-callout font-semibold text-foreground mb-0.5">{item.symbol}</p>
                                            <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">{item.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                      <span
                          className={`text-footnote font-semibold tabular ${
                              item.change >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                          }`}
                      >
                        {item.change >= 0 ? "+" : ""}
                          {item.change}%
                      </span>
                                            <span
                                                className={`text-caption font-medium flex items-center gap-0.5 ${
                                                    item.change24h >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                                                }`}
                                            >
                        {item.change24h >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                        ) : (
                            <ArrowDownRight className="w-3 h-3" />
                        )}
                                                {Math.abs(item.change24h)}%
                      </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <p className="text-subhead tabular text-foreground">{item.amount}</p>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <p className="text-subhead font-semibold tabular text-foreground">¥{item.value.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <p className="text-subhead tabular text-[rgb(var(--foreground-secondary))]">
                                            ¥{item.totalCost.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end justify-center">
                                        <p
                                            className={`text-subhead font-semibold tabular ${
                                                gainLoss >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                                            }`}
                                        >
                                            {gainLoss >= 0 ? "+" : ""}¥{gainLoss.toLocaleString()}
                                        </p>
                                        <p
                                            className={`text-footnote font-medium tabular ${
                                                gainLoss >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                                            }`}
                                        >
                                            {gainLoss >= 0 ? "+" : ""}
                                            {gainLossPercent}%
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>

            {/* Mobile Nav */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 backdrop-blur-xl bg-background/90 border-t border-border">
                <div className="flex items-center justify-around py-2">
                    {navigation.slice(0, 4).map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 py-2.5 px-4 transition-colors ${
                                item.active ? "text-[rgb(var(--accent))]" : "text-[rgb(var(--foreground-tertiary))]"
                            }`}
                        >
                            <item.icon className="w-[22px] h-[22px]" strokeWidth={2} />
                            <span className="text-caption font-medium">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    )
}
