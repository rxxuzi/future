import type { MonthlyStats } from "@/lib/mock"

interface StatsGridProps {
    stats: MonthlyStats
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
            <div>
                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">
                    Net Worth
                </p>
                <p className="text-title-3 tabular mb-1.5 text-foreground">
                    ¥{stats.netWorth.toLocaleString()}
                </p>
                <p className="text-footnote font-medium text-[rgb(var(--positive))]">
                    +1.24% vs last month
                </p>
            </div>

            <div>
                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">
                    Monthly Income
                </p>
                <p className="text-title-3 tabular mb-1.5 text-foreground">
                    ¥{stats.monthlyIncome.toLocaleString()}
                </p>
                <p className="text-footnote font-medium text-[rgb(var(--positive))]">
                    +12.5% vs last month
                </p>
            </div>

            <div>
                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">
                    Monthly Expense
                </p>
                <p className="text-title-3 tabular mb-1.5 text-foreground">
                    ¥{stats.monthlyExpense.toLocaleString()}
                </p>
                <p className="text-footnote font-medium text-[rgb(var(--negative))]">
                    -8.2% vs last month
                </p>
            </div>

            <div>
                <p className="text-footnote text-[rgb(var(--foreground-tertiary))] mb-3">
                    Savings Rate
                </p>
                <p className="text-title-3 tabular mb-1.5 text-foreground">
                    {stats.savingsRate}%
                </p>
                <p className="text-footnote font-medium text-[rgb(var(--positive))]">
                    +2.1% vs last month
                </p>
            </div>
        </div>
    )
}