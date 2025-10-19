"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { FutureLogo } from "@/components/FutureLogo"

interface MobileHeaderProps {
    /** ヘッダーに表示するタイトル（指定しない場合はロゴを表示） */
    title?: string
    /** ヘッダー右側に表示するアクション要素 */
    actions?: ReactNode
    /** 背景をブラー効果にするか */
    blur?: boolean
    /** カスタムクラス名 */
    className?: string
}

export function MobileHeader({
                                 title,
                                 actions,
                                 blur = true,
                                 className = ""
                             }: MobileHeaderProps) {
    return (
        <header
            className={`
        lg:hidden sticky top-0 z-50 border-b border-border
        ${blur ? 'backdrop-blur-xl bg-background/90' : 'bg-background'}
        ${className}
      `}
        >
            <div className="flex items-center justify-between px-6 py-4 min-h-[64px]">
                {/* 左側: タイトルまたはロゴ */}
                {title ? (
                    <h1 className="text-callout font-semibold text-foreground truncate flex-1">
                        {title}
                    </h1>
                ) : (
                    <Link
                        href="/home"
                        className="flex items-center gap-2 group"
                        aria-label="Future ホームページへ"
                    >
                        <FutureLogo
                            size={28}
                            className="transition-transform group-hover:scale-110"
                        />
                        <span className="text-callout font-semibold text-foreground">
              Future
            </span>
                    </Link>
                )}

                {/* 右側: アクション要素 */}
                {actions && (
                    <div className="flex items-center gap-2 ml-4">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    )
}

// 型定義のエクスポート
export type { MobileHeaderProps }