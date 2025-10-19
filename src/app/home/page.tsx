"use client"

import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
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
import { Layout } from "@/components/layout/Layout"
import { mockPortfolio, mockBalanceHistory, mockExpenseBreakdown } from "@/lib/mock"

export default function HomePage() {
    return (
        <Layout maxWidth="max-w-[1200px]">
            {/* Balance Section */}
            <div className="mb-16">
                <p className="text-caption font-semibold text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider mb-4">
                    Total Balance
                </p>
                <h1 className="text-display tabular mb-20 text-foreground">¥12,458,932</h1>

                {/* Stats Grid */}
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

            {/* This Month Section */}
            <div className="mb-16">
                <h2 className="text-title-2 mb-8 text-foreground">This Month</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income Card */}
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

                    {/* Expense Card */}
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

            {/* Charts Section */}
            <div className="mb-16">
                <h2 className="text-title-2 mb-8 text-foreground">Overview</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Balance History Chart */}
                    <div className="glass-card rounded-2xl p-8">
                        <h3 className="text-title-3 mb-6 text-foreground">Balance History</h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={mockBalanceHistory}>
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
                                        data={mockExpenseBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {mockExpenseBreakdown.map((entry, index) => (
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
                                {mockExpenseBreakdown.map((item) => (
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

            {/* Portfolio Section */}
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
                    {mockPortfolio.slice(0, 4).map((item) => (
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
        </Layout>
    )
}