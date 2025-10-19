"use client"

import { useEffect, useRef, memo } from "react"

interface SymbolInfoProps {
    /** TradingViewのシンボル */
    symbol: string
    /** テーマ */
    colorTheme?: "light" | "dark"
    /** 幅 */
    width?: string | number
    /** ロケール */
    locale?: string
    /** カスタムクラス */
    className?: string
}

/**
 * TradingView Symbol Info ウィジェット
 *
 * 銘柄の基本情報（価格、変動率、出来高など）を表示
 *
 * @example
 * ```tsx
 * <SymbolInfo
 *   symbol="NASDAQ:AAPL"
 *   colorTheme="dark"
 *   width="100%"
 * />
 * ```
 */
function SymbolInfo({
                        symbol,
                        colorTheme = "dark",
                        width = "100%",
                        locale = "en",
                        className = "",
                    }: SymbolInfoProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のコンテンツをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            symbol,
            colorTheme,
            isTransparent: true,
            locale,
            width: typeof width === 'number' ? width.toString() : width,
        })

        container.current.appendChild(script)

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [symbol, colorTheme, width, locale])

    return (
        <div className={`tradingview-widget-container ${className}`}>
            <div className="tradingview-widget-container__widget" ref={container} />
        </div>
    )
}

export default memo(SymbolInfo)

// 型定義のエクスポート
export type { SymbolInfoProps }