"use client"

import { TrendingUp, ArrowDownLeft, ArrowUpRight, Home, Activity, BarChart3, Settings, LineChart as LineChartIcon } from "lucide-react"
import Link from "next/link"
import {
    Line,
    LineChart,
    Pie,
    PieChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import FutureLogo from "@/components/FutureLogo";

export default function HomePage() {
    const navigation = [
        { name: "Home", icon: Home, href: "/home", active: true },
        { name: "Transactions", icon: Activity, href: "/transactions", active: false },
        { name: "Portfolio", icon: TrendingUp, href: "/portfolio", active: false },
        { name: "Markets", icon: LineChartIcon, href: "/markets", active: false },
        { name: "Analytics", icon: BarChart3, href: "/analytics", active: false },
        { name: "Settings", icon: Settings, href: "/settings", active: false },
    ]

    const portfolio = [
        { symbol: "BTC", name: "Bitcoin", value: 2847293, change: 2.34, amount: "0.5234 BTC" },
        { symbol: "AAPL", name: "Apple Inc.", value: 3284750, change: -0.87, amount: "150 shares" },
        { symbol: "GOOGL", name: "Alphabet Inc.", value: 2847293, change: 1.45, amount: "75 shares" },
        { symbol: "ETH", name: "Ethereum", value: 1284750, change: 3.21, amount: "3.2847 ETH" },
    ]

    const balanceHistory = [
        { month: "Jan", balance: 10200000 },
        { month: "Feb", balance: 10800000 },
        { month: "Mar", balance: 11200000 },
        { month: "Apr", balance: 11500000 },
        { month: "May", balance: 11900000 },
        { month: "Jun", balance: 12458932 },
    ]

    const expenseBreakdown = [
        { category: "Housing", value: 120000, color: "rgb(var(--chart-1))" },
        { category: "Food", value: 65000, color: "rgb(var(--chart-2))" },
        { category: "Transport", value: 45000, color: "rgb(var(--chart-3))" },
        { category: "Entertainment", value: 35000, color: "rgb(var(--chart-4))" },
        { category: "Others", value: 22540, color: "rgb(var(--chart-5))" },
    ]

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col border-r border-border bg-background">
                <div className="flex flex-col h-full p-6">
                    <Link href="/home" className="flex items-center gap-2.5 mb-12">
                        <FutureLogo size={28} className="transition-transform group-hover:scale-110" />
                        <span className="text-[17px] font-semibold tracking-tight text-foreground">Future</span>
                    </Link>

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
                    <Link href="/" className="flex items-center gap-2">
                        <FutureLogo size={28} className="transition-transform group-hover:scale-110" />
                        <span className="text-callout font-semibold text-foreground">Future</span>
                    </Link>
                </div>
            </header>

            {/* Main */}
            <main className="lg:ml-60 lg:pl-16 px-6 lg:pr-16 py-12 pb-32 lg:pb-16">
                <div className="max-w-[1200px]">
                    {/* Balance */}
                    <div className="mb-16">
                        <p className="text-caption font-semibold text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider mb-4">
                            Total Balance
                        </p>
                        <h1 className="text-display tabular mb-20 text-foreground">¥12,458,932</h1>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
                            <div>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">Net Worth</p>
                                <p className="text-title-3 tabular mb-1.5 text-foreground">¥12,458,932</p>
                                <p className="text-footnote font-medium text-[rgb(var(--positive))]">+1.24% vs last month</p>
                            </div>
                            <div>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">Monthly Income</p>
                                <p className="text-title-3 tabular mb-1.5 text-foreground">¥458,320</p>
                                <p className="text-footnote font-medium text-[rgb(var(--positive))]">+12.5% vs last month</p>
                            </div>
                            <div>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">Monthly Expense</p>
                                <p className="text-title-3 tabular mb-1.5 text-foreground">¥287,540</p>
                                <p className="text-footnote font-medium text-[rgb(var(--negative))]">-8.2% vs last month</p>
                            </div>
                            <div>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">Savings Rate</p>
                                <p className="text-title-3 tabular mb-1.5 text-foreground">37.3%</p>
                                <p className="text-footnote font-medium text-[rgb(var(--positive))]">+2.1% vs last month</p>
                            </div>
                        </div>
                    </div>

                    {/* This Month */}
                    <div className="mb-16">
                        <h2 className="text-title-2 mb-8 text-foreground">This Month</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="glass-card rounded-2xl p-8 transition-colors hover:border-[rgb(var(--positive))]/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-11 h-11 rounded-full bg-[rgb(var(--positive))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--positive))]/20">
                                        <ArrowDownLeft className="w-5 h-5 text-[rgb(var(--positive))]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-callout font-medium text-[rgb(var(--foreground-secondary))]">Income</span>
                                </div>
                                <p className="text-[40px] font-bold tabular text-[rgb(var(--positive))] mb-2 leading-none">¥458,320</p>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">+¥52,340 from last month</p>
                            </div>

                            <div className="glass-card rounded-2xl p-8 transition-colors hover:border-[rgb(var(--negative))]/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-11 h-11 rounded-full bg-[rgb(var(--negative))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--negative))]/20">
                                        <ArrowUpRight className="w-5 h-5 text-[rgb(var(--negative))]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-callout font-medium text-[rgb(var(--foreground-secondary))]">Expense</span>
                                </div>
                                <p className="text-[40px] font-bold tabular text-[rgb(var(--negative))] mb-2 leading-none">¥287,540</p>
                                <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">-¥23,610 from last month</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="mb-16">
                        <h2 className="text-title-2 mb-8 text-foreground">Overview</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Balance History Chart */}
                            <div className="glass-card rounded-2xl p-8">
                                <h3 className="text-title-3 mb-6 text-foreground">Balance History</h3>
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart data={balanceHistory}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" stroke="rgb(var(--foreground-tertiary))" style={{ fontSize: 12 }} />
                                        <YAxis
                                            stroke="rgb(var(--foreground-tertiary))"
                                            style={{ fontSize: 12 }}
                                            tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "rgb(var(--surface))",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                                color: "rgb(var(--foreground))",
                                            }}
                                            formatter={(value: number) => [`¥${value.toLocaleString()}`, "Balance"]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="balance"
                                            stroke="rgb(var(--accent))"
                                            strokeWidth={2}
                                            dot={{ fill: "rgb(var(--accent))", r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Expense Breakdown Chart */}
                            <div className="glass-card rounded-2xl p-8">
                                <h3 className="text-title-3 mb-6 text-foreground">Expense Breakdown</h3>
                                <div className="flex items-center gap-8">
                                    <ResponsiveContainer width="50%" height={240}>
                                        <PieChart>
                                            <Pie
                                                data={expenseBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {expenseBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "rgb(var(--surface))",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "8px",
                                                    color: "rgb(var(--foreground))",
                                                }}
                                                formatter={(value: number) => `¥${value.toLocaleString()}`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex-1 space-y-3">
                                        {expenseBreakdown.map((item) => (
                                            <div key={item.category} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-footnote text-[rgb(var(--foreground-secondary))]">{item.category}</span>
                                                </div>
                                                <span className="text-footnote font-medium text-foreground tabular">
                          ¥{item.value.toLocaleString()}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-title-2 text-foreground">Portfolio</h2>
                            <Link
                                href="/portfolio"
                                className="text-callout font-medium text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))] transition-colors"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {portfolio.map((item) => (
                                <div key={item.symbol} className="glass-card rounded-2xl p-6 transition-colors hover:border-white/10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <p className="text-title-3 mb-1 text-foreground">{item.symbol}</p>
                                            <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">{item.name}</p>
                                        </div>
                                        <span
                                            className={`text-footnote font-semibold tabular px-2.5 py-1 rounded-md ${
                                                item.change >= 0
                                                    ? "text-[rgb(var(--positive))] bg-[rgb(var(--positive))]/10"
                                                    : "text-[rgb(var(--negative))] bg-[rgb(var(--negative))]/10"
                                            }`}
                                        >
                      {item.change >= 0 ? "+" : ""}
                                            {item.change}%
                    </span>
                                    </div>
                                    <div>
                                        <p className="text-title-1 tabular mb-1.5 text-foreground">¥{item.value.toLocaleString()}</p>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">{item.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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