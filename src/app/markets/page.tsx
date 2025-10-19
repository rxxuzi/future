"use client"

import {
    TrendingUp,
    Home,
    Activity,
    BarChart3,
    Settings,
    Search,
    Star,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MarketsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState<"all" | "crypto" | "stocks">("all")

    const navigation = [
        { name: "Overview", icon: Home, href: "/", active: false },
        { name: "Transactions", icon: Activity, href: "/transactions", active: false },
        { name: "Portfolio", icon: TrendingUp, href: "/portfolio", active: false },
        { name: "Analytics", icon: BarChart3, href: "/analytics", active: false },
        { name: "Settings", icon: Settings, href: "/settings", active: false },
    ]

    const markets = [
        { symbol: "BTC", name: "Bitcoin", price: 5440000, change: 2.34, change24h: 1.2, volume: "¥2.4T", type: "crypto" },
        { symbol: "ETH", name: "Ethereum", price: 391000, change: 3.21, change24h: 2.1, volume: "¥1.2T", type: "crypto" },
        {
            symbol: "AAPL",
            name: "Apple Inc.",
            price: 21900,
            change: -0.87,
            change24h: -0.3,
            volume: "¥890B",
            type: "stocks",
        },
        {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            price: 37980,
            change: 1.45,
            change24h: 0.8,
            volume: "¥650B",
            type: "stocks",
        },
        { symbol: "SOL", name: "Solana", price: 18500, change: 5.67, change24h: 3.4, volume: "¥580B", type: "crypto" },
        {
            symbol: "TSLA",
            name: "Tesla Inc.",
            price: 36950,
            change: -2.15,
            change24h: -1.5,
            volume: "¥720B",
            type: "stocks",
        },
        {
            symbol: "MSFT",
            name: "Microsoft Corp.",
            price: 21850,
            change: 0.92,
            change24h: 0.4,
            volume: "¥810B",
            type: "stocks",
        },
        {
            symbol: "BNB",
            name: "Binance Coin",
            price: 42300,
            change: 1.89,
            change24h: 1.1,
            volume: "¥420B",
            type: "crypto",
        },
    ]

    const filteredMarkets = markets.filter((market) => {
        const matchesSearch =
            market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            market.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" || market.type === filter
        return matchesSearch && matchesFilter
    })

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

            {/* Main */}
            <main className="lg:ml-60 lg:pl-16 px-6 lg:pr-16 py-12 pb-32 lg:pb-16">
                <div className="max-w-[1400px]">
                    <div className="flex items-center justify-between mb-12">
                        <h1 className="text-display text-foreground">Markets</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--foreground-tertiary))]" />
                                <input
                                    type="text"
                                    placeholder="Search markets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-border rounded-lg text-subhead text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50 w-64"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`px-4 py-2 rounded-lg text-subhead font-medium transition-colors ${
                                        filter === "all"
                                            ? "bg-[rgb(var(--accent))] text-white"
                                            : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter("crypto")}
                                    className={`px-4 py-2 rounded-lg text-subhead font-medium transition-colors ${
                                        filter === "crypto"
                                            ? "bg-[rgb(var(--accent))] text-white"
                                            : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                    }`}
                                >
                                    Crypto
                                </button>
                                <button
                                    onClick={() => setFilter("stocks")}
                                    className={`px-4 py-2 rounded-lg text-subhead font-medium transition-colors ${
                                        filter === "stocks"
                                            ? "bg-[rgb(var(--accent))] text-white"
                                            : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                    }`}
                                >
                                    Stocks
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Markets Table */}
                    <div className="border-t border-border">
                        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-4 py-4 px-4 border-b border-border/50">
                            <div className="w-8" />
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider">
                                Name
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                Price
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                24h Change
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                24h %
                            </p>
                            <p className="text-footnote font-medium text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider text-right">
                                Volume
                            </p>
                        </div>

                        {filteredMarkets.map((market) => (
                            <div
                                key={market.symbol}
                                className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-4 py-5 px-4 border-b border-border/30 hover:bg-white/[0.02] transition-colors cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <button className="text-[rgb(var(--foreground-tertiary))] hover:text-[rgb(var(--accent))] transition-colors">
                                        <Star className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="text-callout font-semibold text-foreground">{market.symbol}</p>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">{market.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <p className="text-subhead font-semibold tabular text-foreground">¥{market.price.toLocaleString()}</p>
                                </div>

                                <div className="flex items-center justify-end">
                  <span
                      className={`text-subhead font-semibold tabular ${
                          market.change >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                      }`}
                  >
                    {market.change >= 0 ? "+" : ""}
                      {market.change}%
                  </span>
                                </div>

                                <div className="flex items-center justify-end">
                  <span
                      className={`text-subhead font-medium flex items-center gap-1 ${
                          market.change24h >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                      }`}
                  >
                    {market.change24h >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                      {Math.abs(market.change24h)}%
                  </span>
                                </div>

                                <div className="flex items-center justify-end">
                                    <p className="text-subhead tabular text-[rgb(var(--foreground-secondary))]">{market.volume}</p>
                                </div>
                            </div>
                        ))}
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
