"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface AddTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (transaction: {
        type: "income" | "expense"
        amount: number
        category: string
        date: string
        note: string
    }) => void
}

export function AddTransactionModal({ isOpen, onClose, onAdd }: AddTransactionModalProps) {
    const [type, setType] = useState<"income" | "expense">("income")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [note, setNote] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd({
            type,
            amount: Number.parseFloat(amount),
            category,
            date,
            note,
        })
        setAmount("")
        setCategory("")
        setNote("")
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[rgb(var(--surface))] border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-title-2 text-foreground">Add Transaction</h2>
                    <button
                        onClick={onClose}
                        className="text-[rgb(var(--foreground-tertiary))] hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-2 block">Type</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setType("income")}
                                className={`flex-1 py-2.5 rounded-lg text-subhead font-medium transition-colors ${
                                    type === "income"
                                        ? "bg-[rgb(var(--positive))]/10 text-[rgb(var(--positive))] ring-1 ring-[rgb(var(--positive))]/30"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("expense")}
                                className={`flex-1 py-2.5 rounded-lg text-subhead font-medium transition-colors ${
                                    type === "expense"
                                        ? "bg-[rgb(var(--negative))]/10 text-[rgb(var(--negative))] ring-1 ring-[rgb(var(--negative))]/30"
                                        : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10"
                                }`}
                            >
                                Expense
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-2 block">
                            Amount (¥)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-white/5 border border-border rounded-lg text-subhead text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-2 block">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-white/5 border border-border rounded-lg text-subhead text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50"
                            placeholder="e.g., Salary, Food, Transport"
                        />
                    </div>

                    <div>
                        <label className="text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-2 block">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-white/5 border border-border rounded-lg text-subhead text-foreground focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50"
                        />
                    </div>

                    <div>
                        <label className="text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-2 block">
                            Note (optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-white/5 border border-border rounded-lg text-subhead text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50 resize-none"
                            placeholder="Add a note..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white font-semibold rounded-lg transition-colors"
                    >
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>
    )
}
