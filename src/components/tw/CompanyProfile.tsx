"use client"

import { useEffect, useRef, memo } from "react"

interface CompanyProfileProps {
    /** TradingViewのシンボル */
    symbol: string
    /** テーマ */
    colorTheme?: "light" | "dark"
    /** 幅 */
    width?: string | number
    /** 高さ */
    height?: string | number
    /** ロケール */
    locale?: string
    /** カスタムクラス */
    className?: string
}

/**
 * TradingView Company Profile ウィジェット
 *
 * 企業の詳細情報（事業内容、セクター、従業員数、ウェブサイトなど）を表示
 *
 * @example
 * ```tsx
 * <CompanyProfile
 *   symbol="NASDAQ:AAPL"
 *   colorTheme="dark"
 *   width="100%"
 *   height={450}
 * />
 * ```
 */
function CompanyProfile({
                            symbol,
                            colorTheme = "dark",
                            width = "100%",
                            height = 450,
                            locale = "en",
                            className = "",
                        }: CompanyProfileProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のコンテンツをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            symbol,
            colorTheme,
            isTransparent: true,
            locale,
            width: typeof width === 'number' ? width.toString() : width,
            height: typeof height === 'number' ? height.toString() : height,
        })

        container.current.appendChild(script)

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [symbol, colorTheme, width, height, locale])

    return (
        <div className={`tradingview-widget-container ${className}`}>
            <div className="tradingview-widget-container__widget" ref={container} />
        </div>
    )
}

export default memo(CompanyProfile)

// 型定義のエクスポート
export type { CompanyProfileProps }