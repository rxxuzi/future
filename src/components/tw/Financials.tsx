"use client"

import { useEffect, useRef, memo } from "react"

interface FinancialsProps {
    /** TradingViewのシンボル */
    symbol: string
    /** テーマ */
    colorTheme?: "light" | "dark"
    /** 表示モード */
    displayMode?: "regular" | "compact"
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
 * TradingView Financials ウィジェット
 *
 * 企業の財務データ（収益、利益、EPS、PERなど）を表示
 * 株式銘柄向けのファンダメンタル分析データ
 *
 * @example
 * ```tsx
 * <Financials
 *   symbol="NASDAQ:AAPL"
 *   colorTheme="dark"
 *   displayMode="regular"
 *   height={550}
 * />
 * ```
 */
function Financials({
                        symbol,
                        colorTheme = "dark",
                        displayMode = "regular",
                        width = "100%",
                        height = 550,
                        locale = "en",
                        className = "",
                    }: FinancialsProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のコンテンツをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            symbol,
            colorTheme,
            displayMode,
            isTransparent: true,
            locale,
            width: typeof width === 'number' ? width : width,
            height: typeof height === 'number' ? height : height,
        })

        container.current.appendChild(script)

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [symbol, colorTheme, displayMode, width, height, locale])

    return (
        <div className={`tradingview-widget-container ${className}`}>
            <div className="tradingview-widget-container__widget" ref={container} />
        </div>
    )
}

export default memo(Financials)

// 型定義のエクスポート
export type { FinancialsProps }