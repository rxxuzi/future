"use client"

import { useEffect, useRef, memo, useState } from "react"

interface SymbolSearchProps {
    /** シンボル選択時のコールバック */
    onSymbolSelect: (symbol: string) => void
    /** テーマ */
    theme?: "light" | "dark"
    /** 幅 */
    width?: string | number
    /** 高さ */
    height?: string | number
    /** ロケール */
    locale?: string
    /** プレースホルダーテキスト */
    placeholder?: string
    /** カスタムクラス */
    className?: string
}

/**
 * TradingView Symbol Search コンポーネント
 *
 * 銘柄コードを検索・選択するための入力フィールド
 * カスタム実装（TradingViewの検索ウィジェットは埋め込み非対応のため）
 *
 * @example
 * ```tsx
 * <SymbolSearch
 *   onSymbolSelect={(symbol) => console.log(symbol)}
 *   theme="dark"
 *   placeholder="Search symbols..."
 * />
 * ```
 */
function SymbolSearch({
                          onSymbolSelect,
                          theme = "dark",
                          width = "100%",
                          height = 40,
                          locale = "en",
                          placeholder = "Search symbols (e.g., AAPL, BTC, EUR/USD)",
                          className = "",
                      }: SymbolSearchProps) {
    const [inputValue, setInputValue] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // よく使われる銘柄のサンプル（実際のAPIがないため）
    const popularSymbols = {
        stocks: [
            "NASDAQ:AAPL", "NASDAQ:MSFT", "NASDAQ:GOOGL", "NASDAQ:AMZN", "NASDAQ:TSLA",
            "NASDAQ:META", "NASDAQ:NVDA", "NYSE:JPM", "NYSE:V", "NYSE:JNJ"
        ],
        crypto: [
            "BITSTAMP:BTCUSD", "BITSTAMP:ETHUSD", "BINANCE:BNBUSDT", "BINANCE:SOLUSDT",
            "BINANCE:ADAUSDT", "BINANCE:DOGEUSD", "BINANCE:AVAXUSDT", "BINANCE:MATICUSDT"
        ],
        forex: [
            "FX:EURUSD", "FX:GBPUSD", "FX:USDJPY", "FX:AUDUSD", "FX:USDCAD",
            "FX:USDCHF", "FX:NZDUSD", "FX:EURJPY", "FX:GBPJPY", "FX:EURGBP"
        ],
        indices: [
            "FOREXCOM:SPXUSD", "FOREXCOM:NSXUSD", "FOREXCOM:DJI", "INDEX:NKY",
            "INDEX:DAX", "INDEX:FTSE", "INDEX:HSI", "TVC:SHCOMP"
        ]
    }

    const allSymbols = [
        ...popularSymbols.stocks,
        ...popularSymbols.crypto,
        ...popularSymbols.forex,
        ...popularSymbols.indices
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase()
        setInputValue(value)

        if (value.length > 0) {
            const filtered = allSymbols.filter(symbol =>
                symbol.includes(value) || symbol.split(":")[1]?.includes(value)
            ).slice(0, 8)
            setSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }

    const handleSelectSymbol = (symbol: string) => {
        setInputValue(symbol)
        onSymbolSelect(symbol)
        setShowSuggestions(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue) {
            // 直接入力されたシンボルを処理
            const symbol = inputValue.includes(":") ? inputValue : `NASDAQ:${inputValue}`
            handleSelectSymbol(symbol)
        }
    }

    // クリック外側でサジェストを閉じる
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const inputStyles = theme === "dark"
        ? "bg-[rgb(var(--surface))] text-foreground placeholder-[rgb(var(--foreground-tertiary))] border-border focus:ring-[rgb(var(--accent))]"
        : "bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:ring-blue-500"

    const suggestionStyles = theme === "dark"
        ? "bg-[rgb(var(--surface))] border-border text-foreground hover:bg-[rgb(var(--surface-hover))]"
        : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            style={{ width: typeof width === 'number' ? `${width}px` : width }}
        >
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-2
                    border rounded-lg
                    focus:outline-none focus:ring-2 focus:border-transparent
                    font-mono text-sm transition-colors
                    ${inputStyles}
                `}
                style={{ height: typeof height === 'number' ? `${height}px` : height }}
            />

            {/* サジェストドロップダウン */}
            {showSuggestions && suggestions.length > 0 && (
                <div className={`
                    absolute top-full mt-1 w-full
                    border rounded-lg shadow-lg z-50
                    ${suggestionStyles}
                `}>
                    {suggestions.map((symbol, index) => {
                        const [exchange, ticker] = symbol.split(":")
                        return (
                            <div
                                key={index}
                                onClick={() => handleSelectSymbol(symbol)}
                                className={`
                                    px-4 py-2 cursor-pointer
                                    flex justify-between items-center
                                    transition-colors
                                    ${index !== suggestions.length - 1 ? 'border-b border-border' : ''}
                                    hover:bg-[rgba(var(--accent),0.1)]
                                `}
                            >
                                <span className="font-mono font-semibold">{ticker}</span>
                                <span className="text-xs text-[rgb(var(--foreground-tertiary))]">{exchange}</span>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ヘルプテキスト */}
            {inputValue.length === 0 && !showSuggestions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[rgb(var(--foreground-tertiary))] pointer-events-none">
                    Press Enter to search
                </div>
            )}
        </div>
    )
}

export default memo(SymbolSearch)

// 型定義のエクスポート
export type { SymbolSearchProps }