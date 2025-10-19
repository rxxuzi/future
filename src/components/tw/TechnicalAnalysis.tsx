"use client"

import { useEffect, useRef, memo } from "react"

interface TechnicalAnalysisProps {
    /** TradingViewのシンボル */
    symbol: string
    /** テーマ */
    colorTheme?: "light" | "dark"
    /** 時間軸 */
    interval?: "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1D" | "1W" | "1M"
    /** 幅 */
    width?: string | number
    /** 高さ */
    height?: string | number
    /** 表示モード */
    displayMode?: "single" | "multiple"
    /** インターバルタブを表示するか */
    showIntervalTabs?: boolean
    /** ロケール */
    locale?: string
    /** カスタムクラス */
    className?: string
}

/**
 * TradingView Technical Analysis ウィジェット
 *
 * テクニカル指標に基づいた売買シグナルを表示
 * RSI、MACD、移動平均線などの分析結果を提供
 *
 * @example
 * ```tsx
 * <TechnicalAnalysis
 *   symbol="NASDAQ:AAPL"
 *   colorTheme="dark"
 *   interval="1D"
 *   showIntervalTabs={true}
 * />
 * ```
 */
function TechnicalAnalysis({
                               symbol,
                               colorTheme = "dark",
                               interval = "1D",
                               width = "100%",
                               height = 450,
                               displayMode = "single",
                               showIntervalTabs = true,
                               locale = "en",
                               className = "",
                           }: TechnicalAnalysisProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のコンテンツをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            symbol,
            colorTheme,
            displayMode,
            isTransparent: true,
            locale,
            interval,
            disableInterval: false,
            width: typeof width === 'number' ? width : width,
            height: typeof height === 'number' ? height : height,
            showIntervalTabs,
        })

        container.current.appendChild(script)

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [symbol, colorTheme, interval, width, height, displayMode, showIntervalTabs, locale])

    return (
        <div className={`tradingview-widget-container ${className}`}>
            <div className="tradingview-widget-container__widget" ref={container} />
        </div>
    )
}

export default memo(TechnicalAnalysis)

// 型定義のエクスポート
export type { TechnicalAnalysisProps }