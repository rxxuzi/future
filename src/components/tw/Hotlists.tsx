// Updated Hotlists.tsx with onSymbolClick support
"use client"

import { useEffect, useRef, memo } from "react"

interface HotlistsProps {
    /** 取引所 */
    exchange?: "US" | "CRYPTO"
    /** テーマ */
    colorTheme?: "light" | "dark"
    /** 期間 */
    dateRange?: "1D" | "1W" | "1M" | "3M" | "12M" | "ALL"
    /** チャートを表示するか */
    showChart?: boolean
    /** 幅 */
    width?: string | number
    /** 高さ */
    height?: string | number
    /** ロケール */
    locale?: string
    /** シンボルクリック時のコールバック */
    onSymbolClick?: (symbol: string) => void
    /** カスタムクラス */
    className?: string
}

/**
 * TradingView Hotlists ウィジェット
 *
 * Stock & Crypto両対応のトップムーバー表示
 * クリックで銘柄詳細へ遷移可能
 */
function Hotlists({
                      exchange = "US",
                      colorTheme = "dark",
                      dateRange = "12M",
                      showChart = true,
                      width = "100%",
                      height = 600,
                      locale = "en",
                      onSymbolClick,
                      className = "",
                  }: HotlistsProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のスクリプトをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            exchange,
            colorTheme,
            dateRange,
            showChart,
            locale,
            largeChartUrl: "",
            isTransparent: true,
            showSymbolLogo: true,
            showFloatingTooltip: true,
            // Future風のカラー設定
            plotLineColorGrowing: "rgba(34, 197, 94, 1)",
            plotLineColorFalling: "rgba(239, 68, 68, 1)",
            gridLineColor: "rgba(255, 255, 255, 0.05)",
            scaleFontColor: "#737373",
            belowLineFillColorGrowing: "rgba(34, 197, 94, 0.1)",
            belowLineFillColorFalling: "rgba(239, 68, 68, 0.1)",
            belowLineFillColorGrowingBottom: "rgba(34, 197, 94, 0)",
            belowLineFillColorFallingBottom: "rgba(239, 68, 68, 0)",
            symbolActiveColor: "rgba(59, 130, 246, 0.1)",
            width: typeof width === 'number' ? width.toString() : width,
            height: typeof height === 'number' ? height.toString() : height,
        })

        container.current.appendChild(script)

        // シンボルクリックのイベントリスナー
        if (onSymbolClick) {
            const handleClick = (e: MouseEvent) => {
                const target = e.target as HTMLElement
                const symbolElement = target.closest('[data-symbol]')
                if (symbolElement) {
                    const symbol = symbolElement.getAttribute('data-symbol')
                    if (symbol) {
                        onSymbolClick(symbol)
                    }
                }
            }

            container.current.addEventListener('click', handleClick)

            return () => {
                container.current?.removeEventListener('click', handleClick)
                if (container.current) {
                    container.current.innerHTML = ""
                }
            }
        }

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [exchange, colorTheme, dateRange, showChart, width, height, locale, onSymbolClick])

    return (
        <div className={`tradingview-widget-container ${className}`}>
            <div className="tradingview-widget-container__widget" ref={container} />
        </div>
    )
}

export default memo(Hotlists)

// 型定義のエクスポート
export type { HotlistsProps }