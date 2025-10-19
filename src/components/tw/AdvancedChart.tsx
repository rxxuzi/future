"use client"

import { useEffect, useRef, memo } from "react"

interface AdvancedChartProps {
    /** TradingViewのシンボル（例: NASDAQ:AAPL, BITSTAMP:BTCUSD） */
    symbol?: string
    /** 時間軸 */
    interval?: "1" | "3" | "5" | "15" | "30" | "60" | "120" | "240" | "D" | "W" | "M"
    /** テーマ */
    theme?: "light" | "dark"
    /** ロケール */
    locale?: string
    /** シンボル変更を許可するか */
    allowSymbolChange?: boolean
    /** サイドバーを非表示にするか */
    hideSideToolbar?: boolean
    /** トップツールバーを非表示にするか */
    hideTopToolbar?: boolean
    /** 出来高を非表示にするか */
    hideVolume?: boolean
    /** 自動サイズ調整 */
    autosize?: boolean
    /** カスタムクラス */
    className?: string
}

/**
 * TradingView Advanced Chart ウィジェット
 *
 * プロフェッショナルなチャート分析ツール
 * テクニカル指標、描画ツール、複数時間軸対応
 *
 * @example
 * ```tsx
 * <AdvancedChart
 *   symbol="NASDAQ:AAPL"
 *   theme="dark"
 *   allowSymbolChange={true}
 * />
 * ```
 */
function AdvancedChart({
                           symbol = "NASDAQ:AAPL",
                           interval = "D",
                           theme = "dark",
                           locale = "en",
                           allowSymbolChange = true,
                           hideSideToolbar = false,
                           hideTopToolbar = false,
                           hideVolume = false,
                           autosize = true,
                           className = "",
                       }: AdvancedChartProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のスクリプトをクリア
        container.current.innerHTML = ""

        const widgetContainer = document.createElement("div")
        widgetContainer.className = "tradingview-widget-container__widget"
        widgetContainer.style.height = "calc(100% - 32px)"
        widgetContainer.style.width = "100%"

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            symbol,
            interval,
            theme,
            locale,
            allow_symbol_change: allowSymbolChange,
            calendar: false,
            details: false,
            hide_side_toolbar: hideSideToolbar,
            hide_top_toolbar: hideTopToolbar,
            hide_legend: false,
            hide_volume: hideVolume,
            hotlist: false,
            save_image: true,
            style: "1",
            timezone: "Etc/UTC",
            // Future風のカラー
            backgroundColor: "#000000",
            gridColor: "rgba(255, 255, 255, 0.06)",
            watchlist: [],
            withdateranges: false,
            compareSymbols: [],
            studies: [],
            autosize,
        })

        widgetContainer.appendChild(script)
        container.current.appendChild(widgetContainer)

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [symbol, interval, theme, locale, allowSymbolChange, hideSideToolbar, hideTopToolbar, hideVolume, autosize])

    return (
        <div
            className={`tradingview-widget-container ${className}`}
            style={{ height: "100%", width: "100%" }}
            ref={container}
        />
    )
}

export default memo(AdvancedChart)

// 型定義のエクスポート
export type { AdvancedChartProps }