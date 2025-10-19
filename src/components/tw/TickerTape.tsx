"use client"

import { useEffect, useRef, memo } from "react"

export interface TradingViewSymbol {
    /** TradingViewのシンボル（例: BITSTAMP:BTCUSD） */
    proName: string
    /** 表示名 */
    title: string
}

interface TickerTapeProps {
    /** 表示するシンボルのリスト */
    symbols?: TradingViewSymbol[]
    /** テーマカラー */
    colorTheme?: "light" | "dark"
    /** ロケール */
    locale?: string
    /** シンボルロゴを表示するか */
    showSymbolLogo?: boolean
    /** 表示モード */
    displayMode?: "adaptive" | "regular" | "compact"
    /** カスタムクラス名 */
    className?: string
}

/**
 * TradingView ティッカーテープウィジェット
 *
 * リアルタイムで価格が流れるティッカー表示
 *
 * @example
 * ```tsx
 * <TickerTape
 *   symbols={[
 *     { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
 *     { proName: "NASDAQ:AAPL", title: "Apple" }
 *   ]}
 *   colorTheme="dark"
 * />
 * ```
 */
function TickerTape({
                        symbols = [
                            { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
                            { proName: "FOREXCOM:NSXUSD", title: "US 100" },
                            { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
                            { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
                            { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
                        ],
                        colorTheme = "dark",
                        locale = "en",
                        showSymbolLogo = true,
                        displayMode = "adaptive",
                        className = "",
                    }: TickerTapeProps) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!container.current) return

        // 既存のスクリプトをクリア
        container.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
        script.type = "text/javascript"
        script.async = true
        script.innerHTML = JSON.stringify({
            symbols,
            colorTheme,
            isTransparent: true,
            displayMode,
            locale,
            showSymbolLogo,
        })

        container.current.appendChild(script)

        // クリーンアップ
        return () => {
            if (container.current) {
                container.current.innerHTML = ""
            }
        }
    }, [symbols, colorTheme, displayMode, locale, showSymbolLogo])

    return (
        <div className={`tradingview-widget-container w-full ${className}`}>
            <div className="tradingview-widget-container__widget" ref={container} />
        </div>
    )
}

export default memo(TickerTape)

// 型定義のエクスポート
export type { TickerTapeProps }