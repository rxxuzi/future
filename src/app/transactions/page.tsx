"use client"

import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { mockTransactions } from "@/lib/mock"

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

export default function TransactionsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
    const [selectedMonth, setSelectedMonth] = useState(5)
    const [selectedYear, setSelectedYear] = useState(2024)

    const filteredTransactions = mockTransactions.filter((transaction) => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterType === "all" || transaction.type === filterType
        return matchesSearch && matchesFilter
    })

    const totalIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = Math.abs(
        filteredTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0)
    )

    const net = totalIncome - totalExpense

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
                    <h1 className="text-[32px] font-bold tracking-tight text-foreground mb-2">
                        Transactions
                    </h1>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="border-b border-border">
                <div className="px-8 py-4 flex items-center justify-between">
                    {/* Month Navigation */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePreviousMonth}
                            className="w-8 h-8 flex items-center justify-center border border-border hover:bg-[rgb(var(--surface))] transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
                        </button>
                        <div className="min-w-[160px] text-center">
              <span className="text-sm font-semibold text-foreground">
                {months[selectedMonth]} {selectedYear}
              </span>
                        </div>
                        <button
                            onClick={handleNextMonth}
                            className="w-8 h-8 flex items-center justify-center border border-border hover:bg-[rgb(var(--surface))] transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={2} />
                        </button>
                    </div>

                    {/* Add Button */}
                    <button className="hidden lg:flex items-center gap-2 px-4 h-9 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white transition-colors text-sm font-medium">
                        <Plus className="w-4 h-4" strokeWidth={2} />
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="border-b border-border">
                <div className="grid grid-cols-3">
                    <div className="px-8 py-6 border-r border-border">
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                            Total Income
                        </div>
                        <div className="text-2xl font-bold tabular text-emerald-400">
                            ¥{totalIncome.toLocaleString()}
                        </div>
                    </div>
                    <div className="px-8 py-6 border-r border-border">
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                            Total Expense
                        </div>
                        <div className="text-2xl font-bold tabular text-red-400">
                            ¥{totalExpense.toLocaleString()}
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <div className="text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                            Net
                        </div>
                        <div className={`text-2xl font-bold tabular ${net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {net >= 0 ? "+" : ""}¥{net.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-border">
                <div className="px-8 py-4 flex items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--foreground-tertiary))]" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 pl-10 pr-4 bg-[rgb(var(--surface))] border border-border text-sm text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-1 border-b border-border -mb-4">
                        <button
                            onClick={() => setFilterType("all")}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                filterType === "all"
                                    ? "text-foreground border-[rgb(var(--accent))]"
                                    : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType("income")}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                filterType === "income"
                                    ? "text-foreground border-emerald-400"
                                    : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                            }`}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setFilterType("expense")}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                filterType === "expense"
                                    ? "text-foreground border-red-400"
                                    : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                            }`}
                        >
                            Expense
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div>
                {/* Table Header */}
                <div className="grid grid-cols-[100px_1fr_140px_160px_120px] gap-6 px-8 py-4 bg-[rgb(var(--surface))] border-b border-border sticky top-0">
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))]">
                        Date
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))]">
                        Description
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))]">
                        Category
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] text-right">
                        Amount
                    </div>
                    <div className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] text-center">
                        Status
                    </div>
                </div>

                {/* Table Body */}
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                        <div
                            key={transaction.id}
                            className={`grid grid-cols-[100px_1fr_140px_160px_120px] gap-6 px-8 py-4 hover:bg-[rgb(var(--surface))] transition-colors ${
                                index !== filteredTransactions.length - 1 ? "border-b border-border" : ""
                            }`}
                        >
                            {/* Date */}
                            <div className="text-sm text-[rgb(var(--foreground-secondary))] font-mono">
                                {new Date(transaction.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                })}
                            </div>

                            {/* Description */}
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                    transaction.type === "income" ? "bg-emerald-400" : "bg-red-400"
                                }`} />
                                <span className="text-sm font-medium text-foreground">
                  {transaction.description}
                </span>
                            </div>

                            {/* Category */}
                            <div className="text-sm text-[rgb(var(--foreground-secondary))]">
                                {transaction.category}
                            </div>

                            {/* Amount */}
                            <div className={`text-sm font-semibold tabular text-right ${
                                transaction.type === "income" ? "text-emerald-400" : "text-red-400"
                            }`}>
                                {transaction.amount >= 0 ? "+" : ""}¥{Math.abs(transaction.amount).toLocaleString()}
                            </div>

                            {/* Status */}
                            <div className="text-center">
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${
                    transaction.status === "completed"
                        ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                        : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                }`}>
                  {transaction.status}
                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-8 py-20 text-center border-b border-border">
                        <p className="text-sm text-[rgb(var(--foreground-tertiary))]">
                            No transactions found
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-border">
                <p className="text-xs text-[rgb(var(--foreground-tertiary))] font-mono">
                    Showing {filteredTransactions.length} of {mockTransactions.length} transactions
                </p>
            </div>
        </Layout>
    )
}