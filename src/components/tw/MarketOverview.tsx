"use client"

import { useEffect, useRef, memo } from "react"

interface MarketTab {
    title: string
    symbols: Array<{
        s: string  // symbol
        d: string  // description
    }>
    originalTitle: string
}

interface MarketOverviewProps {
    /** 表示するタブ */
    tabs?: MarketTab[]
    /** テーマ */
    colorTheme?: "light" | "dark"
    /** 期間 */
    dateRange?: "1D" | "1W" | "1M" | "3M" | "12M" | "ALL"
    /** 幅 */
    width?: string | number
    /** 高さ */
    height?: string | number
    /** ロケール */
    locale?: string
    /** チャートを表示するか */
    showChart?: boolean
    /** シンボルロゴを表示するか */
    showSymbolLogo?: boolean
    /** カスタムクラス */
    className?: string
}

// デフォルトタブ設定
const defaultTabs: MarketTab[] = [
    {
        title: "Indices",
        symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
            { s: "FOREXCOM:DJI", d: "Dow Jones" },
            { s: "INDEX:NKY", d: "Nikkei 225" },
        ],
        originalTitle: "Indices"
    },
    {
        title: "Crypto",
        symbols: [
            { s: "BITSTAMP:BTCUSD", d: "Bitcoin" },
            { s: "BITSTAMP:ETHUSD", d: "Ethereum" },
            { s: "BINANCE:SOLUSDT", d: "Solana" },
            { s: "BINANCE:BNBUSDT", d: "BNB" },
            { s: "BINANCE:ADAUSDT", d: "Cardano" },
        ],
        originalTitle: "Crypto"
    },
    {
        title: "Forex",
        symbols: [
            { s: "FX:EURUSD", d: "EUR/USD" },
            { s: "FX:GBPUSD", d: "GBP/USD" },
            { s: "FX:USDJPY", d: "USD/JPY" },
            { s: "FX:AUDUSD", d: "AUD/USD" },
        ],
        originalTitle: "Forex"
    },
    {
        title: "Commodities",
        symbols: [
            { s: "CMCMARKETS:GOLD", d: "Gold" },
            { s: "TVC:SILVER", d: "Silver" },
            { s: "PYTH:WTI3!", d: "Crude Oil" },
            { s: "ECONOMICS:USIRYY", d: "US 10Y" },
        ],
        originalTitle: "Commodities"
    }
]

/**
 * TradingView Market Overview ウィジェット
 *
 * 複数の市場をタブで切り替えて表示
 * Indices, Crypto, Forex, Commodities など
 *
 * @example
 * ```tsx
 * <MarketOverview
 *   colorTheme="dark"
 *   showChart={true}
 *   height={600}
 * />
 * ```
 */
function MarketOverview({
                            tabs = defaultTabs,
                            colorTheme = "dark",
                            dateRange = "12M",
                            width = "100%",
                            height = 600,
                            locale = "en",
                            showChart = true,
                            showSymbolLogo = true,
                            className = "",
                        }: MarketOverviewProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のスクリプトをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            colorTheme,
            dateRange,
            locale,
            largeChartUrl: "",
            isTransparent: true,
            showFloatingTooltip: false,
            // Future風のカラー設定
            plotLineColorGrowing: "rgba(59, 130, 246, 1)",
            plotLineColorFalling: "rgba(59, 130, 246, 1)",
            gridLineColor: "rgba(255, 255, 255, 0.05)",
            scaleFontColor: "#737373",
            belowLineFillColorGrowing: "rgba(59, 130, 246, 0.1)",
            belowLineFillColorFalling: "rgba(59, 130, 246, 0.1)",
            belowLineFillColorGrowingBottom: "rgba(59, 130, 246, 0)",
            belowLineFillColorFallingBottom: "rgba(59, 130, 246, 0)",
            symbolActiveColor: "rgba(59, 130, 246, 0.1)",
            tabs,
            backgroundColor: "#000000",
            width: typeof width === 'number' ? width.toString() : width,
            height: typeof height === 'number' ? height.toString() : height,
            showSymbolLogo,
            showChart,
        })

        container.current.appendChild(script)

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [tabs, colorTheme, dateRange, width, height, locale, showChart, showSymbolLogo])

    return (
        <div className={`tradingview-widget-container ${className}`}>
            <div className="tradingview-widget-container__widget" ref={container} />
        </div>
    )
}

export default memo(MarketOverview)

// 型定義のエクスポート
export type { MarketOverviewProps, MarketTab }