"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, TrendingUp, LineChart, BarChart3, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { FutureLogo } from "@/components/FutureLogo"

interface NavItem {
    name: string
    icon: LucideIcon
    href: string
}

interface SidebarProps {
    /** ユーザー名 */
    userName?: string
    /** ユーザーのメールアドレス */
    userEmail?: string
    /** ユーザーのイニシャル（アバター表示用） */
    userInitials?: string
    /** カスタムナビゲーションアイテム */
    customNavItems?: NavItem[]
}

const defaultNavItems: NavItem[] = [
    { name: "Home", icon: Home, href: "/home" },
    { name: "Transactions", icon: Activity, href: "/transactions" },
    { name: "Portfolio", icon: TrendingUp, href: "/portfolio" },
    { name: "Markets", icon: LineChart, href: "/markets" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar({
                            userName = "John Doe",
                            userEmail = "john@example.com",
                            userInitials = "JD",
                            customNavItems
                        }: SidebarProps) {
    const pathname = usePathname()
    const navItems = customNavItems || defaultNavItems

    return (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col border-r border-border bg-background z-40">
            <div className="flex flex-col h-full p-6">
                {/* Logo */}
                <Link
                    href="/home"
                    className="flex items-center gap-2.5 mb-12 group"
                    aria-label="Future ホームページへ"
                >
                    <FutureLogo
                        size={28}
                        className="transition-transform group-hover:scale-110"
                    />
                    <span className="text-[17px] font-semibold tracking-tight text-foreground">
            Future
          </span>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 space-y-1" aria-label="メインナビゲーション">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                  text-subhead font-medium transition-colors
                  ${isActive
                                    ? "bg-[rgb(var(--accent))] text-white"
                                    : "text-[rgb(var(--foreground-secondary))] hover:bg-white/5 hover:text-foreground"
                                }
                `}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile */}
                <div className="border-t border-border pt-6">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 rounded-lg hover:bg-white/5 transition-colors py-2"
                        aria-label="ユーザー設定"
                    >
                        <div
                            className="h-8 w-8 rounded-full bg-[rgb(var(--accent))]/10 flex items-center justify-center flex-shrink-0 ring-1 ring-[rgb(var(--accent))]/20"
                            aria-hidden="true"
                        >
              <span className="text-caption font-semibold text-[rgb(var(--accent))]">
                {userInitials}
              </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-subhead font-medium text-foreground truncate">
                                {userName}
                            </p>
                            <p className="text-caption text-[rgb(var(--foreground-tertiary))] truncate">
                                {userEmail}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </aside>
    )
}

// 型定義のエクスポート
export type { NavItem, SidebarProps }