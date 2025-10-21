"use client"

import { TrendingUp, DollarSign, PieChart, Activity } from "lucide-react"
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
    ResponsiveContainer,
} from "recharts"
import { Layout } from "@/components/layout/Layout"
import {
    mockPortfolioData,
    mockAccountsData,
    mockMonthlyData,
    mockCategorySpending,
    mockPortfolioPerformance
} from "@/lib/mock"

export default function AnalyticsPage() {
    const [timePeriod, setTimePeriod] = useState<"1w" | "1m" | "3m" | "6m" | "1y" | "all">("1m")
    const [chartView, setChartView] = useState<"performance" | "allocation" | "pnl">("performance")

    // Calculate aggregated metrics
    const totalPortfolioValue = mockPortfolioData.reduce((sum, item) => sum + item.current_value, 0)
    const totalUnrealizedPnL = mockPortfolioData.reduce((sum, item) => sum + item.unrealized_pnl, 0)
    const totalCostBasis = mockPortfolioData.reduce((sum, item) => sum + (item.quantity * item.avg_cost), 0)
    const totalReturn = totalCostBasis > 0 ? ((totalUnrealizedPnL / totalCostBasis) * 100) : 0

    const avgMonthlyIncome = mockMonthlyData.reduce((sum, m) => sum + m.income, 0) / mockMonthlyData.length
    const avgMonthlyExpense = mockMonthlyData.reduce((sum, m) => sum + m.expense, 0) / mockMonthlyData.length
    const avgMonthlySavings = avgMonthlyIncome - avgMonthlyExpense
    const savingsRate = avgMonthlyIncome > 0 ? (avgMonthlySavings / avgMonthlyIncome * 100) : 0

    // Best and worst performers
    const sortedByPerformance = [...mockPortfolioData].sort((a, b) => b.unrealized_pnl_percent - a.unrealized_pnl_percent)
    const bestPerformer = sortedByPerformance[0]
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1]

    // Asset allocation by type
    const assetsByType = mockPortfolioData.reduce((acc, item) => {
        const type = item.asset_type === 'crypto' ? 'Crypto' : 'Stocks'
        if (!acc[type]) acc[type] = 0
        acc[type] += item.current_value
        return acc
    }, {} as Record<string, number>)

    const allocationData = Object.entries(assetsByType).map(([name, value]) => ({
        name,
        value,
        color: name === 'Crypto' ? "rgb(59, 130, 246)" : "rgb(139, 92, 246)"
    }))

    // Add cash from accounts
    const cashBalance = mockAccountsData.reduce((sum, acc) =>
        acc.type === 'cash' ? sum + acc.balance : sum, 0
    )
    if (cashBalance > 0) {
        allocationData.push({
            name: 'Cash',
            value: cashBalance,
            color: "rgb(34, 197, 94)"
        })
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
            {/* Header */}
            <div className="border-b border-border">
                <div className="px-8 py-6">
                    <h1 className="text-[32px] font-bold tracking-tight text-foreground">
                        Analytics
                    </h1>
                </div>
            </div>

            {/* Time Period Controls */}
            <div className="border-b border-border">
                <div className="px-8 py-4 flex items-center justify-between">
                    <div className="flex gap-1">
                        {(['1w', '1m', '3m', '6m', '1y', 'all'] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimePeriod(period)}
                                className={`px-3 py-1 text-xs font-medium transition-colors ${
                                    timePeriod === period
                                        ? "bg-[rgb(var(--accent))] text-white"
                                        : "bg-[rgb(var(--surface))] text-[rgb(var(--foreground-secondary))] hover:text-foreground"
                                }`}
                            >
                                {period === 'all' ? 'All' : period.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="text-xs text-[rgb(var(--foreground-tertiary))] font-mono">
                        Last updated: 2 minutes ago
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="border-b border-border">
                <div className="grid grid-cols-2 lg:grid-cols-4">
                    {/* Portfolio Value */}
                    <div className="px-8 py-6 border-r border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-[rgb(var(--accent))]" strokeWidth={2} />
                            <span className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                                Portfolio Value
                            </span>
                        </div>
                        <p className="text-2xl font-bold tabular text-foreground mb-1">
                            ¥{totalPortfolioValue.toLocaleString()}
                        </p>
                        <p className={`text-xs font-medium ${totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}% total return
                        </p>
                    </div>

                    {/* Unrealized P&L */}
                    <div className="px-8 py-6 border-r border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                            <span className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                                Unrealized P&L
                            </span>
                        </div>
                        <p className={`text-2xl font-bold tabular ${totalUnrealizedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {totalUnrealizedPnL >= 0 ? '+' : ''}¥{Math.abs(totalUnrealizedPnL).toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                            From {mockPortfolioData.length} assets
                        </p>
                    </div>

                    {/* Monthly Income */}
                    <div className="px-8 py-6 border-r border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[rgb(var(--accent))]" strokeWidth={2} />
                            <span className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                                Avg Monthly Income
                            </span>
                        </div>
                        <p className="text-2xl font-bold tabular text-foreground mb-1">
                            ¥{Math.round(avgMonthlyIncome).toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-emerald-400">
                            +8.5% vs last period
                        </p>
                    </div>

                    {/* Savings Rate */}
                    <div className="px-8 py-6">
                        <div className="flex items-center gap-2 mb-2">
                            <PieChart className="w-4 h-4 text-[rgb(var(--accent))]" strokeWidth={2} />
                            <span className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                                Savings Rate
                            </span>
                        </div>
                        <p className="text-2xl font-bold tabular text-foreground mb-1">
                            {savingsRate.toFixed(1)}%
                        </p>
                        <p className="text-xs font-medium text-emerald-400">
                            ¥{Math.round(avgMonthlySavings).toLocaleString()}/mo
                        </p>
                    </div>
                </div>
            </div>

            {/* Performance Summary */}
            <div className="border-b border-border">
                <div className="grid grid-cols-2 lg:grid-cols-4">
                    {/* Best Performer */}
                    <div className="px-8 py-4 border-r border-border">
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-1">
                            Best Performer
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            {bestPerformer?.symbol}
                        </div>
                        <div className="text-xs font-medium text-emerald-400">
                            +{bestPerformer?.unrealized_pnl_percent.toFixed(2)}%
                        </div>
                    </div>

                    {/* Worst Performer */}
                    <div className="px-8 py-4 border-r border-border">
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-1">
                            Worst Performer
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            {worstPerformer?.symbol}
                        </div>
                        <div className={`text-xs font-medium ${
                            worstPerformer?.unrealized_pnl_percent >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                            {worstPerformer?.unrealized_pnl_percent >= 0 ? '+' : ''}
                            {worstPerformer?.unrealized_pnl_percent.toFixed(2)}%
                        </div>
                    </div>

                    {/* Total Accounts */}
                    <div className="px-8 py-4 border-r border-border">
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-1">
                            Active Accounts
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            {mockAccountsData.length}
                        </div>
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                            {mockAccountsData.filter(a => a.type === 'investment').length} investment
                        </div>
                    </div>

                    {/* Total Assets */}
                    <div className="px-8 py-4">
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-1">
                            Total Holdings
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            {mockPortfolioData.length} assets
                        </div>
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                            {mockPortfolioData.filter(a => a.asset_type === 'crypto').length} crypto, {' '}
                            {mockPortfolioData.filter(a => a.asset_type === 'stock').length} stocks
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Controls */}
            <div className="border-b border-border">
                <div className="px-8 py-4 flex gap-1">
                    <button
                        onClick={() => setChartView("performance")}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-4 ${
                            chartView === "performance"
                                ? "text-foreground border-[rgb(var(--accent))]"
                                : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                        }`}
                    >
                        Performance
                    </button>
                    <button
                        onClick={() => setChartView("allocation")}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-4 ${
                            chartView === "allocation"
                                ? "text-foreground border-[rgb(var(--accent))]"
                                : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                        }`}
                    >
                        Allocation
                    </button>
                    <button
                        onClick={() => setChartView("pnl")}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-4 ${
                            chartView === "pnl"
                                ? "text-foreground border-[rgb(var(--accent))]"
                                : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                        }`}
                    >
                        Income vs Expense
                    </button>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="px-8 py-8 border-b border-border">
                {chartView === "performance" && (
                    <div>
                        <h2 className="text-sm font-semibold text-foreground mb-6">
                            Portfolio Performance
                        </h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={mockPortfolioPerformance}>
                                <CartesianGrid strokeDasharray="0" stroke="rgb(var(--border))" />
                                <XAxis
                                    dataKey="month"
                                    stroke="rgb(var(--foreground-tertiary))"
                                    style={{ fontSize: 12 }}
                                    axisLine={{ stroke: "rgb(var(--border))" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="rgb(var(--foreground-tertiary))"
                                    style={{ fontSize: 12 }}
                                    tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
                                    axisLine={{ stroke: "rgb(var(--border))" }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgb(var(--surface))",
                                        border: "1px solid rgb(var(--border))",
                                        borderRadius: "0",
                                        color: "rgb(var(--foreground))",
                                    }}
                                    formatter={(value: number) => [`¥${value.toLocaleString()}`, ""]}
                                />
                                <Line
                                    type="linear"
                                    dataKey="btc"
                                    stroke="rgb(59, 130, 246)"
                                    strokeWidth={2}
                                    dot={false}
                                    name="BTC"
                                />
                                <Line
                                    type="linear"
                                    dataKey="eth"
                                    stroke="rgb(34, 197, 94)"
                                    strokeWidth={2}
                                    dot={false}
                                    name="ETH"
                                />
                                <Line
                                    type="linear"
                                    dataKey="aapl"
                                    stroke="rgb(139, 92, 246)"
                                    strokeWidth={2}
                                    dot={false}
                                    name="AAPL"
                                />
                                <Line
                                    type="linear"
                                    dataKey="googl"
                                    stroke="rgb(236, 72, 153)"
                                    strokeWidth={2}
                                    dot={false}
                                    name="GOOGL"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {chartView === "allocation" && (
                    <div>
                        <h2 className="text-sm font-semibold text-foreground mb-6">
                            Asset Allocation
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Pie Chart */}
                            <ResponsiveContainer width="100%" height={280}>
                                <RechartsPieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgb(var(--surface))",
                                            border: "1px solid rgb(var(--border))",
                                            borderRadius: "0",
                                            color: "rgb(var(--foreground))",
                                        }}
                                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>

                            {/* Breakdown Table */}
                            <div>
                                <div className="space-y-4">
                                    {allocationData.map((item, index) => {
                                        const totalAllocation = allocationData.reduce((sum, i) => sum + i.value, 0)
                                        const percentage = (item.value / totalAllocation * 100).toFixed(1)

                                        return (
                                            <div key={index} className="border-b border-border pb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className="text-sm font-medium text-foreground">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-foreground tabular">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                                        Value
                                                    </span>
                                                    <span className="text-xs text-[rgb(var(--foreground-secondary))] tabular">
                                                        ¥{item.value.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {chartView === "pnl" && (
                    <div>
                        <h2 className="text-sm font-semibold text-foreground mb-6">
                            Income vs Expense Trend
                        </h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={mockMonthlyData}>
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
                                <CartesianGrid strokeDasharray="0" stroke="rgb(var(--border))" />
                                <XAxis
                                    dataKey="month"
                                    stroke="rgb(var(--foreground-tertiary))"
                                    style={{ fontSize: 12 }}
                                    axisLine={{ stroke: "rgb(var(--border))" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="rgb(var(--foreground-tertiary))"
                                    style={{ fontSize: 12 }}
                                    tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                                    axisLine={{ stroke: "rgb(var(--border))" }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgb(var(--surface))",
                                        border: "1px solid rgb(var(--border))",
                                        borderRadius: "0",
                                        color: "rgb(var(--foreground))",
                                    }}
                                    formatter={(value: number) => [`¥${value.toLocaleString()}`, ""]}
                                />
                                <Area
                                    type="linear"
                                    dataKey="income"
                                    stroke="rgb(34, 197, 94)"
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="linear"
                                    dataKey="expense"
                                    stroke="rgb(239, 68, 68)"
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Category Spending Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left: Spending by Category */}
                <div className="px-8 py-8 border-b border-r border-border">
                    <h2 className="text-sm font-semibold text-foreground mb-6">
                        Spending by Category
                    </h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={mockCategorySpending} layout="vertical">
                            <CartesianGrid strokeDasharray="0" stroke="rgb(var(--border))" />
                            <XAxis
                                type="number"
                                stroke="rgb(var(--foreground-tertiary))"
                                style={{ fontSize: 12 }}
                                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                                axisLine={{ stroke: "rgb(var(--border))" }}
                                tickLine={false}
                            />
                            <YAxis
                                dataKey="category"
                                type="category"
                                stroke="rgb(var(--foreground-tertiary))"
                                style={{ fontSize: 12 }}
                                axisLine={{ stroke: "rgb(var(--border))" }}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgb(var(--surface))",
                                    border: "1px solid rgb(var(--border))",
                                    borderRadius: "0",
                                    color: "rgb(var(--foreground))",
                                }}
                                formatter={(value: number) => [`¥${value.toLocaleString()}`, "Amount"]}
                            />
                            <Bar dataKey="amount" fill="rgb(59, 130, 246)" radius={[0, 0, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Right: Monthly Summary */}
                <div className="px-8 py-8 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground mb-6">
                        Monthly Summary
                    </h2>
                    <div className="space-y-4">
                        {mockMonthlyData.slice(-3).map((month, index) => {
                            const savingRate = month.income > 0
                                ? ((month.savings / month.income) * 100).toFixed(1)
                                : "0.0"

                            return (
                                <div key={index} className="border-b border-border pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-foreground">
                                            {month.month}
                                        </span>
                                        <span className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                                            {savingRate}% saved
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))] mb-1">
                                                Income
                                            </p>
                                            <p className="text-sm font-medium text-emerald-400 tabular">
                                                ¥{month.income.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))] mb-1">
                                                Expense
                                            </p>
                                            <p className="text-sm font-medium text-red-400 tabular">
                                                ¥{month.expense.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))] mb-1">
                                                Savings
                                            </p>
                                            <p className="text-sm font-medium text-foreground tabular">
                                                ¥{month.savings.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Asset Performance Table */}
            <div className="px-8 py-8">
                <h2 className="text-sm font-semibold text-foreground mb-6">
                    Asset Performance Details
                </h2>

                {/* Table Header */}
                <div className="grid grid-cols-[120px_1fr_100px_120px_120px_120px_100px] gap-4 py-3 border-b border-border">
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))]">
                        Symbol
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))]">
                        Name
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] text-right">
                        Quantity
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] text-right">
                        Avg Cost
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] text-right">
                        Current
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] text-right">
                        Value
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] text-right">
                        P&L %
                    </div>
                </div>

                {/* Table Body */}
                {mockPortfolioData.map((item, index) => (
                    <div
                        key={item.asset_id}
                        className="grid grid-cols-[120px_1fr_100px_120px_120px_120px_100px] gap-4 py-3 border-b border-border"
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${
                                item.asset_type === 'crypto' ? 'bg-[rgb(var(--accent))]' : 'bg-[rgb(var(--chart-2))]'
                            }`} />
                            <span className="text-sm font-semibold text-foreground font-mono">
                                {item.symbol}
                            </span>
                        </div>
                        <div className="text-sm text-[rgb(var(--foreground-secondary))]">
                            {item.name}
                        </div>
                        <div className="text-sm text-[rgb(var(--foreground-secondary))] text-right tabular">
                            {item.quantity}
                        </div>
                        <div className="text-sm text-[rgb(var(--foreground-secondary))] text-right tabular">
                            ¥{item.avg_cost.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium text-foreground text-right tabular">
                            ¥{item.current_price.toLocaleString()}
                        </div>
                        <div className="text-sm font-semibold text-foreground text-right tabular">
                            ¥{item.current_value.toLocaleString()}
                        </div>
                        <div className={`text-sm font-semibold text-right tabular ${
                            item.unrealized_pnl_percent >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                            {item.unrealized_pnl_percent >= 0 ? '+' : ''}
                            {item.unrealized_pnl_percent.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}