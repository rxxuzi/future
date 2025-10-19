"use client"

import { useEffect, useRef, memo } from "react"

interface ChartProps {
    /** TradingViewのシンボル（例: NASDAQ:AAPL, BITSTAMP:BTCUSD） */
    symbol: string
    /** チャートの幅 */
    width?: number | string
    /** チャートの高さ */
    height?: number | string
    /** テーマ */
    theme?: "light" | "dark"
    /** ロケール */
    locale?: string
    /** 時間軸 */
    interval?: "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M"
    /** カスタムクラス名 */
    className?: string
}

/**
 * TradingView チャートウィジェット
 *
 * 個別銘柄の詳細チャートを表示
 *
 * @example
 * ```tsx
 * <Chart
 *   symbol="NASDAQ:AAPL"
 *   height={500}
 *   theme="dark"
 *   interval="D"
 * />
 * ```
 */
function Chart({
                   symbol,
                   width = "100%",
                   height = 500,
                   theme = "dark",
                   locale = "en",
                   interval = "D",
                   className = "",
               }: ChartProps) {
    const container = useRef<HTMLDivElement>(null)
    const widgetRef = useRef<any>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のウィジェットをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/tv.js"
        script.type = "text/javascript"
        script.async = true

        script.onload = () => {
            if (typeof window !== "undefined" && (window as any).TradingView) {
                const containerId = `tradingview-chart-${Math.random().toString(36).substring(7)}`

                if (container.current) {
                    container.current.id = containerId
                }

                // ウィジェットを作成
                widgetRef.current = new (window as any).TradingView.widget({
                    autosize: true,
                    symbol,
                    interval,
                    timezone: "Etc/UTC",
                    theme,
                    style: "1",
                    locale,
                    enable_publishing: false,
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: false,
                    container_id: containerId,
                })
            }
        }

        container.current.appendChild(script)

        // クリーンアップ
        return () => {
            if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
                widgetRef.current.remove()
            }
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [symbol, theme, locale, interval])

    return (
        <div
            className={`tradingview-widget-container rounded-xl overflow-hidden bg-[rgb(var(--surface))] ${className}`}
            style={{ width, height }}
        >
            <div
                ref={container}
                className="tradingview-widget-container__widget w-full h-full"
            />
        </div>
    )
}

export default memo(Chart)

// 型定義のエクスポート
export type { ChartProps }