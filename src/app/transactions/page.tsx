"use client"

import {
    TrendingUp,
    Home,
    Activity,
    BarChart3,
    Settings,
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TransactionsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
    const [selectedMonth, setSelectedMonth] = useState(5) // June (0-indexed)
    const [selectedYear, setSelectedYear] = useState(2024)

    const navigation = [
        { name: "Overview", icon: Home, href: "/", active: false },
        { name: "Transactions", icon: Activity, href: "/transactions", active: true },
        { name: "Portfolio", icon: TrendingUp, href: "/portfolio", active: false },
        { name: "Analytics", icon: BarChart3, href: "/analytics", active: false },
        { name: "Settings", icon: Settings, href: "/settings", active: false },
    ]

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const transactions = [
        {
            id: 1,
            type: "income",
            description: "Salary Payment",
            amount: 458320,
            date: "2024-01-15",
            category: "Income",
            status: "completed",
        },
        {
            id: 2,
            type: "expense",
            description: "Rent Payment",
            amount: -120000,
            date: "2024-01-14",
            category: "Housing",
            status: "completed",
        },
        {
            id: 3,
            type: "income",
            description: "Freelance Project",
            amount: 85000,
            date: "2024-01-12",
            category: "Income",
            status: "completed",
        },
        {
            id: 4,
            type: "expense",
            description: "Grocery Shopping",
            amount: -15420,
            date: "2024-01-11",
            category: "Food",
            status: "completed",
        },
        {
            id: 5,
            type: "expense",
            description: "Gas Station",
            amount: -8500,
            date: "2024-01-10",
            category: "Transport",
            status: "completed",
        },
        {
            id: 6,
            type: "income",
            description: "Investment Return",
            amount: 42000,
            date: "2024-01-09",
            category: "Investment",
            status: "completed",
        },
        {
            id: 7,
            type: "expense",
            description: "Restaurant",
            amount: -12800,
            date: "2024-01-08",
            category: "Food",
            status: "completed",
        },
        {
            id: 8,
            type: "expense",
            description: "Netflix Subscription",
            amount: -1980,
            date: "2024-01-07",
            category: "Entertainment",
            status: "completed",
        },
    ]

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterType === "all" || transaction.type === filterType
        return matchesSearch && matchesFilter
    })

    const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = Math.abs(
        filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    )

    const handlePreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11)
            setSelectedYear(selectedYear - 1)
        } else {
            setSelectedMonth(selectedMonth - 1)
        }
    }

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0)
            setSelectedYear(selectedYear + 1)
        } else {
            setSelectedMonth(selectedMonth + 1)
        }
    }

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
                <div className="max-w-[1200px]">
                    <h1 className="text-display mb-12 text-foreground">Transactions</h1>

                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePreviousMonth}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <div className="text-title-3 text-foreground tabular min-w-[200px] text-center">
                                {months[selectedMonth]} {selectedYear}
                            </div>
                            <button
                                onClick={handleNextMonth}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-foreground" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="glass-card rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[rgb(var(--positive))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--positive))]/20">
                                    <ArrowDownLeft className="w-5 h-5 text-[rgb(var(--positive))]" strokeWidth={2.5} />
                                </div>
                                <span className="text-subhead font-medium text-[rgb(var(--foreground-secondary))]">Total Income</span>
                            </div>
                            <p className="text-title-1 tabular text-[rgb(var(--positive))]">¥{totalIncome.toLocaleString()}</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[rgb(var(--negative))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--negative))]/20">
                                    <ArrowUpRight className="w-5 h-5 text-[rgb(var(--negative))]" strokeWidth={2.5} />
                                </div>
                                <span className="text-subhead font-medium text-[rgb(var(--foreground-secondary))]">Total Expense</span>
                            </div>
                            <p className="text-title-1 tabular text-[rgb(var(--negative))]">¥{totalExpense.toLocaleString()}</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[rgb(var(--accent))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--accent))]/20">
                                    <TrendingUp className="w-5 h-5 text-[rgb(var(--accent))]" strokeWidth={2.5} />
                                </div>
                                <span className="text-subhead font-medium text-[rgb(var(--foreground-secondary))]">Net</span>
                            </div>
                            <p
                                className={`text-title-1 tabular ${totalIncome - totalExpense >= 0 ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"}`}
                            >
                                ¥{(totalIncome - totalExpense).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--foreground-tertiary))]" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterType("all")}
                                className={`px-4 py-3 rounded-xl text-subhead font-medium transition-colors ${
                                    filterType === "all"
                                        ? "bg-[rgb(var(--accent))] text-white"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType("income")}
                                className={`px-4 py-3 rounded-xl text-subhead font-medium transition-colors ${
                                    filterType === "income"
                                        ? "bg-[rgb(var(--positive))] text-white"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                Income
                            </button>
                            <button
                                onClick={() => setFilterType("expense")}
                                className={`px-4 py-3 rounded-xl text-subhead font-medium transition-colors ${
                                    filterType === "expense"
                                        ? "bg-[rgb(var(--negative))] text-white"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                Expense
                            </button>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-footnote font-semibold text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="text-left px-6 py-4 text-footnote font-semibold text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="text-left px-6 py-4 text-footnote font-semibold text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="text-right px-6 py-4 text-footnote font-semibold text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="text-center px-6 py-4 text-footnote font-semibold text-[rgb(var(--foreground-tertiary))] uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-subhead text-[rgb(var(--foreground-secondary))]">
                                            {new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        transaction.type === "income"
                                                            ? "bg-[rgb(var(--positive))]/10 ring-1 ring-[rgb(var(--positive))]/20"
                                                            : "bg-[rgb(var(--negative))]/10 ring-1 ring-[rgb(var(--negative))]/20"
                                                    }`}
                                                >
                                                    {transaction.type === "income" ? (
                                                        <ArrowDownLeft className="w-5 h-5 text-[rgb(var(--positive))]" strokeWidth={2.5} />
                                                    ) : (
                                                        <ArrowUpRight className="w-5 h-5 text-[rgb(var(--negative))]" strokeWidth={2.5} />
                                                    )}
                                                </div>
                                                <span className="text-subhead font-medium text-foreground">{transaction.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-subhead text-[rgb(var(--foreground-secondary))]">
                                            {transaction.category}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-right text-callout font-semibold tabular ${
                                                transaction.type === "income" ? "text-[rgb(var(--positive))]" : "text-[rgb(var(--negative))]"
                                            }`}
                                        >
                                            {transaction.amount >= 0 ? "+" : ""}¥{Math.abs(transaction.amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-caption font-medium bg-[rgb(var(--positive))]/10 text-[rgb(var(--positive))]">
                          {transaction.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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
