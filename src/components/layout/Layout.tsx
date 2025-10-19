"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { MobileHeader } from "./MobileHeader"
import type { SidebarProps } from "./Sidebar"
import type { MobileNavProps } from "./MobileNav"
import type { MobileHeaderProps } from "./MobileHeader"

interface LayoutProps {
    /** ページコンテンツ */
    children: ReactNode

    /** コンテンツの最大幅 */
    maxWidth?: "max-w-[1200px]" | "max-w-[1400px]" | "max-w-[1600px]" | "max-w-full"

    /** サイドバーを表示するか */
    showSidebar?: boolean

    /** モバイルヘッダーを表示するか */
    showMobileHeader?: boolean

    /** モバイルナビゲーションを表示するか */
    showMobileNav?: boolean

    /** モバイルヘッダーのタイトル */
    mobileHeaderTitle?: string

    /** モバイルヘッダーのアクション要素 */
    mobileHeaderActions?: ReactNode

    /** サイドバーのユーザー情報 */
    user?: {
        name?: string
        email?: string
        initials?: string
    }

    /** カスタムパディング */
    padding?: {
        top?: string
        bottom?: string
        left?: string
        right?: string
    }

    /** カスタムクラス名 */
    className?: string
}

export function Layout({
                           children,
                           maxWidth = "max-w-[1400px]",
                           showSidebar = true,
                           showMobileHeader = true,
                           showMobileNav = true,
                           mobileHeaderTitle,
                           mobileHeaderActions,
                           user,
                           padding,
                           className = ""
                       }: LayoutProps) {
    // デフォルトパディング
    const defaultPadding = {
        top: "py-12",
        bottom: "pb-32 lg:pb-16",
        left: showSidebar ? "lg:ml-60 lg:pl-16" : "",
        right: "px-6 lg:pr-16"
    }

    const appliedPadding = padding ? {
        top: padding.top || defaultPadding.top,
        bottom: padding.bottom || defaultPadding.bottom,
        left: padding.left || defaultPadding.left,
        right: padding.right || defaultPadding.right
    } : defaultPadding

    return (
        <div className="min-h-screen">
            {/* Desktop Sidebar */}
            {showSidebar && (
                <Sidebar
                    userName={user?.name}
                    userEmail={user?.email}
                    userInitials={user?.initials}
                />
            )}

            {/* Mobile Header */}
            {showMobileHeader && (
                <MobileHeader
                    title={mobileHeaderTitle}
                    actions={mobileHeaderActions}
                />
            )}

            {/* Main Content */}
            <main
                className={`
          ${appliedPadding.left}
          ${appliedPadding.right}
          ${appliedPadding.top}
          ${appliedPadding.bottom}
          ${className}
        `}
            >
                <div className={maxWidth}>
                    {children}
                </div>
            </main>

            {/* Mobile Navigation */}
            {showMobileNav && <MobileNav />}
        </div>
    )
}

// 型定義のエクスポート
export type { LayoutProps }