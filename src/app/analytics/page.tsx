"use client"

import { TrendingUp, Home, Activity, BarChart3, Settings, TrendingDown, DollarSign, PieChart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
    Line,
    LineChart,
    Bar,
    BarChart,
    Area,
    AreaChart,
    Pie,
    PieChart as RechartsPieChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

export default function AnalyticsPage() {
    const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("month")

    const navigation = [
        { name: "Overview", icon: Home, href: "/", active: false },
        { name: "Transactions", icon: Activity, href: "/transactions", active: false },
        { name: "Portfolio", icon: TrendingUp, href: "/portfolio", active: false },
        { name: "Analytics", icon: BarChart3, href: "/analytics", active: true },
        { name: "Settings", icon: Settings, href: "/settings", active: false },
    ]

    const monthlyData = [
        { month: "Jan", income: 420000, expense: 310000, savings: 110000 },
        { month: "Feb", income: 445000, expense: 295000, savings: 150000 },
        { month: "Mar", income: 438000, expense: 305000, savings: 133000 },
        { month: "Apr", income: 465000, expense: 285000, savings: 180000 },
        { month: "May", income: 452000, expense: 298000, savings: 154000 },
        { month: "Jun", income: 458000, expense: 287000, savings: 171000 },
    ]

    const categorySpending = [
        { category: "Housing", amount: 120000, percentage: 41.7 },
        { category: "Food", amount: 65000, percentage: 22.6 },
        { category: "Transport", amount: 45000, percentage: 15.6 },
        { category: "Entertainment", amount: 35000, percentage: 12.2 },
        { category: "Others", amount: 22540, percentage: 7.9 },
    ]

    const portfolioPerformance = [
        { month: "Jan", btc: 2650000, aapl: 3100000, googl: 2700000, eth: 1150000 },
        { month: "Feb", btc: 2720000, aapl: 3180000, googl: 2750000, eth: 1200000 },
        { month: "Mar", btc: 2680000, aapl: 3220000, googl: 2780000, eth: 1180000 },
        { month: "Apr", btc: 2750000, aapl: 3250000, googl: 2800000, eth: 1220000 },
        { month: "May", btc: 2800000, aapl: 3270000, googl: 2820000, eth: 1260000 },
        { month: "Jun", btc: 2847293, aapl: 3284750, googl: 2847293, eth: 1284750 },
    ]

    const assetAllocation = [
        { name: "Crypto", value: 4132043, color: "rgb(59, 130, 246)" },
        { name: "Stocks", value: 6132043, color: "rgb(139, 92, 246)" },
        { name: "Cash", value: 2194846, color: "rgb(34, 197, 94)" },
    ]

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
                        <h1 className="text-display text-foreground">Analytics</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTimePeriod("week")}
                                className={`px-4 py-2 rounded-lg text-subhead font-medium transition-colors ${
                                    timePeriod === "week"
                                        ? "bg-[rgb(var(--accent))] text-white"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setTimePeriod("month")}
                                className={`px-4 py-2 rounded-lg text-subhead font-medium transition-colors ${
                                    timePeriod === "month"
                                        ? "bg-[rgb(var(--accent))] text-white"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setTimePeriod("year")}
                                className={`px-4 py-2 rounded-lg text-subhead font-medium transition-colors ${
                                    timePeriod === "year"
                                        ? "bg-[rgb(var(--accent))] text-white"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                Year
                            </button>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="w-4 h-4 text-[rgb(var(--accent))]" strokeWidth={2.5} />
                                <span className="text-footnote text-[rgb(var(--foreground-tertiary))]">Avg Monthly Income</span>
                            </div>
                            <p className="text-[28px] font-bold tabular text-foreground leading-none mb-2">¥446,333</p>
                            <p className="text-footnote font-medium text-[rgb(var(--positive))]">+8.5% vs last period</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown className="w-4 h-4 text-[rgb(var(--negative))]" strokeWidth={2.5} />
                                <span className="text-footnote text-[rgb(var(--foreground-tertiary))]">Avg Monthly Expense</span>
                            </div>
                            <p className="text-[28px] font-bold tabular text-foreground leading-none mb-2">¥296,667</p>
                            <p className="text-footnote font-medium text-[rgb(var(--positive))]">-3.2% vs last period</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-[rgb(var(--positive))]" strokeWidth={2.5} />
                                <span className="text-footnote text-[rgb(var(--foreground-tertiary))]">Avg Monthly Savings</span>
                            </div>
                            <p className="text-[28px] font-bold tabular text-foreground leading-none mb-2">¥149,667</p>
                            <p className="text-footnote font-medium text-[rgb(var(--positive))]">+15.3% vs last period</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <PieChart className="w-4 h-4 text-[rgb(var(--accent))]" strokeWidth={2.5} />
                                <span className="text-footnote text-[rgb(var(--foreground-tertiary))]">Savings Rate</span>
                            </div>
                            <p className="text-[28px] font-bold tabular text-foreground leading-none mb-2">33.5%</p>
                            <p className="text-footnote font-medium text-[rgb(var(--positive))]">+2.8% vs last period</p>
                        </div>
                    </div>

                    {/* Income vs Expense Trend */}
                    <div className="mb-12 pb-12 border-b border-border">
                        <h2 className="text-title-2 mb-6 text-foreground">Income vs Expense Trend</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="rgb(239, 68, 68)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" stroke="rgb(var(--foreground-tertiary))" style={{ fontSize: 12 }} />
                                <YAxis
                                    stroke="rgb(var(--foreground-tertiary))"
                                    style={{ fontSize: 12 }}
                                    tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgb(var(--surface))",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "8px",
                                        color: "rgb(var(--foreground))",
                                    }}
                                    formatter={(value: number) => [`¥${value.toLocaleString()}`, ""]}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="rgb(34, 197, 94)"
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="rgb(239, 68, 68)"
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 pb-12 border-b border-border">
                        {/* Category Spending */}
                        <div>
                            <h2 className="text-title-2 mb-6 text-foreground">Spending by Category</h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={categorySpending} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        type="number"
                                        stroke="rgb(var(--foreground-tertiary))"
                                        style={{ fontSize: 12 }}
                                        tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                                    />
                                    <YAxis
                                        dataKey="category"
                                        type="category"
                                        stroke="rgb(var(--foreground-tertiary))"
                                        style={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgb(var(--surface))",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "8px",
                                            color: "rgb(var(--foreground))",
                                        }}
                                        formatter={(value: number) => [`¥${value.toLocaleString()}`, "Amount"]}
                                    />
                                    <Bar dataKey="amount" fill="rgb(59, 130, 246)" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Asset Allocation */}
                        <div>
                            <h2 className="text-title-2 mb-6 text-foreground">Asset Allocation</h2>
                            <div className="flex items-center gap-8">
                                <ResponsiveContainer width="50%" height={280}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={assetAllocation}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={110}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {assetAllocation.map((entry, index) => (
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
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                                <div className="flex-1 space-y-4">
                                    {assetAllocation.map((item) => (
                                        <div key={item.name}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-subhead text-[rgb(var(--foreground-secondary))]">{item.name}</span>
                                                </div>
                                                <span className="text-subhead font-semibold text-foreground tabular">
                          {((item.value / 12458932) * 100).toFixed(1)}%
                        </span>
                                            </div>
                                            <p className="text-footnote text-[rgb(var(--foreground-tertiary))] tabular">
                                                ¥{item.value.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Performance */}
                    <div>
                        <h2 className="text-title-2 mb-6 text-foreground">Portfolio Performance</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={portfolioPerformance}>
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
                                    formatter={(value: number) => [`¥${value.toLocaleString()}`, ""]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="btc"
                                    stroke="rgb(59, 130, 246)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="BTC"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="aapl"
                                    stroke="rgb(139, 92, 246)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="AAPL"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="googl"
                                    stroke="rgb(236, 72, 153)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="GOOGL"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="eth"
                                    stroke="rgb(34, 197, 94)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="ETH"
                                />
                            </LineChart>
                        </ResponsiveContainer>
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
