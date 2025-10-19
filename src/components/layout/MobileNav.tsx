"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, TrendingUp, LineChart } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface MobileNavItem {
    name: string
    icon: LucideIcon
    href: string
}

interface MobileNavProps {
    /** カスタムナビゲーションアイテム（最大4つ推奨） */
    customNavItems?: MobileNavItem[]
}

const defaultNavItems: MobileNavItem[] = [
    { name: "Home", icon: Home, href: "/home" },
    { name: "Transactions", icon: Activity, href: "/transactions" },
    { name: "Portfolio", icon: TrendingUp, href: "/portfolio" },
    { name: "Markets", icon: LineChart, href: "/markets" },
]

export function MobileNav({ customNavItems }: MobileNavProps) {
    const pathname = usePathname()
    const navItems = customNavItems || defaultNavItems

    // ナビゲーションアイテムは4つまでに制限（モバイルUI的に）
    const limitedNavItems = navItems.slice(0, 4)

    return (
        <nav
            className="lg:hidden fixed bottom-0 inset-x-0 backdrop-blur-xl bg-background/90 border-t border-border z-50 safe-area-inset-bottom"
            aria-label="モバイルナビゲーション"
        >
            <div className="flex items-center justify-around py-2">
                {limitedNavItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex flex-col items-center gap-1 py-2.5 px-4 
                transition-colors min-w-0 flex-1
                ${isActive
                                ? "text-[rgb(var(--accent))]"
                                : "text-[rgb(var(--foreground-tertiary))]"
                            }
              `}
                            aria-current={isActive ? "page" : undefined}
                            aria-label={item.name}
                        >
                            <Icon
                                className="w-[22px] h-[22px] flex-shrink-0"
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                            <span className="text-caption font-medium truncate w-full text-center">
                {item.name}
              </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

// 型定義のエクスポート
export type { MobileNavItem, MobileNavProps }