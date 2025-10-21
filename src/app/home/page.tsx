"use client"

import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
    Line,
    LineChart,
    Area,
    AreaChart,
    Pie,
    PieChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { Layout } from "@/components/layout/Layout"
import {
    mockBalanceHistory,
    mockExpenseBreakdown,
    mockMonthlyData,
    mockTransactions,
    mockAccountsData,
    mockAssetAllocation
} from "@/lib/mock"

export default function HomePage() {
    const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month")

    // Calculate metrics from mock data
    const totalBalance = mockAccountsData.reduce((sum, acc) => sum + acc.balance, 0)

    // Current month data
    const currentMonth = mockMonthlyData[mockMonthlyData.length - 1]
    const previousMonth = mockMonthlyData[mockMonthlyData.length - 2]

    // Calculate month-over-month changes
    const balanceChange = mockBalanceHistory[mockBalanceHistory.length - 1].balance -
        mockBalanceHistory[mockBalanceHistory.length - 2].balance
    const balanceChangePercent = (balanceChange / mockBalanceHistory[mockBalanceHistory.length - 2].balance * 100).toFixed(2)

    const incomeChange = currentMonth.income - previousMonth.income
    const incomeChangePercent = ((incomeChange / previousMonth.income) * 100).toFixed(1)

    const expenseChange = currentMonth.expense - previousMonth.expense
    const expenseChangePercent = ((expenseChange / previousMonth.expense) * 100).toFixed(1)

    const savingsRate = ((currentMonth.savings / currentMonth.income) * 100).toFixed(1)
    const savingsChange = currentMonth.savings - previousMonth.savings
    const savingsChangePercent = ((savingsChange / previousMonth.savings) * 100).toFixed(1)

    // Recent transactions
    const recentTransactions = mockTransactions.slice(0, 5)

    // Calculate net worth trend
    const netWorthData = mockBalanceHistory.map((item, index) => ({
        ...item,
        change: index > 0 ? item.balance - mockBalanceHistory[index - 1].balance : 0
    }))

    return (
        <Layout maxWidth="max-w-[1400px]">
            {/* Balance Section */}
            <div className="border-b border-border pb-8 mb-8">
                <div className="mb-4">
                    <p className="text-xs font-medium text-[rgb(var(--foreground-tertiary))]">
                        Total Balance
                    </p>
                    <h1 className="text-[48px] font-bold tabular text-foreground">
                        ¥{totalBalance.toLocaleString()}
                    </h1>
                    <p className={`text-sm font-medium ${parseFloat(balanceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {parseFloat(balanceChangePercent) >= 0 ? '+' : ''}{balanceChangePercent}% from last month
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-8">
                <div className="border-r border-b border-border p-6">
                    <p className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                        Net Worth
                    </p>
                    <p className="text-2xl font-bold tabular text-foreground mb-1">
                        ¥{totalBalance.toLocaleString()}
                    </p>
                    <p className={`text-xs font-medium ${parseFloat(balanceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {parseFloat(balanceChangePercent) >= 0 ? '+' : ''}{balanceChangePercent}% vs last month
                    </p>
                </div>

                <div className="border-r border-b border-border p-6">
                    <p className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                        Monthly Income
                    </p>
                    <p className="text-2xl font-bold tabular text-foreground mb-1">
                        ¥{currentMonth.income.toLocaleString()}
                    </p>
                    <p className={`text-xs font-medium ${parseFloat(incomeChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {parseFloat(incomeChangePercent) >= 0 ? '+' : ''}{incomeChangePercent}% vs last month
                    </p>
                </div>

                <div className="border-r border-b border-border p-6">
                    <p className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                        Monthly Expense
                    </p>
                    <p className="text-2xl font-bold tabular text-foreground mb-1">
                        ¥{currentMonth.expense.toLocaleString()}
                    </p>
                    <p className={`text-xs font-medium ${parseFloat(expenseChangePercent) <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {parseFloat(expenseChangePercent) >= 0 ? '+' : ''}{expenseChangePercent}% vs last month
                    </p>
                </div>

                <div className="border-b border-border p-6">
                    <p className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                        Savings Rate
                    </p>
                    <p className="text-2xl font-bold tabular text-foreground mb-1">
                        {savingsRate}%
                    </p>
                    <p className={`text-xs font-medium ${parseFloat(savingsChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {parseFloat(savingsChangePercent) >= 0 ? '+' : ''}{savingsChangePercent}% vs last month
                    </p>
                </div>
            </div>

            {/* This Month Section */}
            <div className="mb-8">
                <h2 className="text-sm font-semibold text-foreground mb-6">This Month</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Income Card */}
                    <div className="border border-border p-6 lg:border-r-0">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                                <ArrowDownLeft className="w-5 h-5 text-emerald-400" strokeWidth={2} />
                            </div>
                            <span className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">
                                Income
                            </span>
                        </div>
                        <p className="text-[36px] font-bold tabular text-emerald-400 mb-1 leading-none">
                            ¥{currentMonth.income.toLocaleString()}
                        </p>
                        <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                            {incomeChange >= 0 ? '+' : ''}¥{Math.abs(incomeChange).toLocaleString()} from last month
                        </p>
                    </div>

                    {/* Expense Card */}
                    <div className="border border-border border-t-0 lg:border-t p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-400/10 border border-red-400/20 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-red-400" strokeWidth={2} />
                            </div>
                            <span className="text-sm font-medium text-[rgb(var(--foreground-secondary))]">
                                Expense
                            </span>
                        </div>
                        <p className="text-[36px] font-bold tabular text-red-400 mb-1 leading-none">
                            ¥{currentMonth.expense.toLocaleString()}
                        </p>
                        <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                            {expenseChange >= 0 ? '+' : ''}¥{Math.abs(expenseChange).toLocaleString()} from last month
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mb-8">
                <h2 className="text-sm font-semibold text-foreground mb-6">Overview</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Balance History Chart */}
                    <div className="border border-border p-6 lg:border-r-0">
                        <h3 className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] mb-4">
                            Balance History
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={mockBalanceHistory}>
                                <CartesianGrid strokeDasharray="0" stroke="rgb(var(--border))" />
                                <XAxis
                                    dataKey="month"
                                    stroke="rgb(var(--foreground-tertiary))"
                                    style={{ fontSize: 11 }}
                                    axisLine={{ stroke: "rgb(var(--border))" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="rgb(var(--foreground-tertiary))"
                                    style={{ fontSize: 11 }}
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
                                    formatter={(value: number) => [`¥${value.toLocaleString()}`, "Balance"]}
                                />
                                <Line
                                    type="linear"
                                    dataKey="balance"
                                    stroke="rgb(var(--accent))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Expense Breakdown Chart */}
                    <div className="border border-border border-t-0 lg:border-t p-6">
                        <h3 className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] mb-4">
                            Expense Breakdown
                        </h3>
                        <div className="flex items-center gap-6">
                            <ResponsiveContainer width="45%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={mockExpenseBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {mockExpenseBreakdown.map((entry, index) => (
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
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="flex-1 space-y-2">
                                {mockExpenseBreakdown.map((item, index) => {
                                    const totalExpense = mockExpenseBreakdown.reduce((sum, e) => sum + e.value, 0)
                                    const percentage = ((item.value / totalExpense) * 100).toFixed(1)

                                    return (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-xs text-[rgb(var(--foreground-secondary))]">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-medium text-foreground tabular">
                                                    ¥{item.value.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-[rgb(var(--foreground-tertiary))] ml-2">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Accounts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Recent Transactions */}
                <div className="border border-border p-6 lg:border-r-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
                        <Link
                            href="/transactions"
                            className="text-xs font-medium text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))]"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 flex items-center justify-center border ${
                                        transaction.type === 'income'
                                            ? 'bg-emerald-400/10 border-emerald-400/20'
                                            : 'bg-red-400/10 border-red-400/20'
                                    }`}>
                                        {transaction.type === 'income' ? (
                                            <ArrowDownLeft className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                                        ) : (
                                            <ArrowUpRight className="w-4 h-4 text-red-400" strokeWidth={2} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {transaction.description}
                                        </p>
                                        <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <p className={`text-sm font-semibold tabular ${
                                    transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                    {transaction.type === 'income' ? '+' : '-'}¥{Math.abs(transaction.amount).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Accounts Summary */}
                <div className="border border-border border-t-0 lg:border-t p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-foreground">Accounts</h2>
                        <Link
                            href="/settings"
                            className="text-xs font-medium text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))]"
                        >
                            Manage
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {mockAccountsData.map((account, index) => (
                            <div
                                key={account.id}
                                className="pb-3 border-b border-border last:border-0"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {account.name}
                                        </p>
                                        <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                            {account.institution} • {account.type}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold tabular text-foreground">
                                        ¥{account.balance.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-full bg-[rgb(var(--surface))] h-1">
                                    <div
                                        className="h-full bg-[rgb(var(--accent))]"
                                        style={{
                                            width: `${(account.balance / totalBalance * 100).toFixed(1)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="border border-border border-t-0 p-6">
                <h2 className="text-sm font-semibold text-foreground mb-6">Monthly Trend</h2>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={mockMonthlyData}>
                        <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" stroke="rgb(var(--border))" />
                        <XAxis
                            dataKey="month"
                            stroke="rgb(var(--foreground-tertiary))"
                            style={{ fontSize: 11 }}
                            axisLine={{ stroke: "rgb(var(--border))" }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="rgb(var(--foreground-tertiary))"
                            style={{ fontSize: 11 }}
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
                            dataKey="savings"
                            stroke="rgb(59, 130, 246)"
                            fillOpacity={1}
                            fill="url(#colorSavings)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div className="border-b border-border">
                <div className="px-8 py-6">
                    <h2 className="text-sm font-semibold text-foreground mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/transactions"
                            className="border border-border px-4 py-3 hover:bg-[rgb(var(--surface))] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                    Add Transaction
                                </span>
                                <ArrowUpRight className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" />
                            </div>
                        </Link>
                        <Link
                            href="/portfolio"
                            className="border border-border px-4 py-3 hover:bg-[rgb(var(--surface))] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                    View Portfolio
                                </span>
                                <TrendingUp className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" />
                            </div>
                        </Link>
                        <Link
                            href="/analytics"
                            className="border border-border px-4 py-3 hover:bg-[rgb(var(--surface))] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                    Analytics
                                </span>
                                <TrendingDown className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" />
                            </div>
                        </Link>
                        <Link
                            href="/markets"
                            className="border border-border px-4 py-3 hover:bg-[rgb(var(--surface))] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                    Markets
                                </span>
                                <ArrowUpRight className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}