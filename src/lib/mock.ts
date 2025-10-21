// ポートフォリオアイテム
export interface PortfolioItem {
    symbol: string
    name: string
    value: number
    change: number
    amount: string
    avgCost?: number
    totalCost?: number
    change24h?: number
}

export const mockPortfolio: PortfolioItem[] = [
    {
        symbol: "BTC",
        name: "Bitcoin",
        value: 2847293,
        change: 2.34,
        amount: "0.5234 BTC",
        avgCost: 5200000,
        totalCost: 2721680,
        change24h: 1.2
    },
    {
        symbol: "AAPL",
        name: "Apple Inc.",
        value: 3284750,
        change: -0.87,
        amount: "150 shares",
        avgCost: 21500,
        totalCost: 3225000,
        change24h: -0.3
    },
    {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        value: 2847293,
        change: 1.45,
        amount: "75 shares",
        avgCost: 37200,
        totalCost: 2790000,
        change24h: 0.8
    },
    {
        symbol: "ETH",
        name: "Ethereum",
        value: 1284750,
        change: 3.21,
        amount: "3.2847 ETH",
        avgCost: 380000,
        totalCost: 1248186,
        change24h: 2.1
    },
    {
        symbol: "TSLA",
        name: "Tesla Inc.",
        value: 1847293,
        change: -2.15,
        amount: "50 shares",
        avgCost: 38500,
        totalCost: 1925000,
        change24h: -1.5
    },
    {
        symbol: "MSFT",
        name: "Microsoft Corp.",
        value: 2184750,
        change: 0.92,
        amount: "100 shares",
        avgCost: 21500,
        totalCost: 2150000,
        change24h: 0.4
    },
]

// ============================================
// Portfolio Mock Data
// ============================================

export const mockPortfolioData = [
    {
        asset_id: "1",
        symbol: "BTC",
        name: "Bitcoin",
        asset_type: "crypto",
        quantity: 0.5234,
        avg_cost: 5200000,
        current_price: 5440000,
        current_value: 2847296,
        unrealized_pnl: 125616,
        unrealized_pnl_percent: 4.62
    },
    {
        asset_id: "2",
        symbol: "ETH",
        name: "Ethereum",
        asset_type: "crypto",
        quantity: 3.2847,
        avg_cost: 380000,
        current_price: 391000,
        current_value: 1284318,
        unrealized_pnl: 36132,
        unrealized_pnl_percent: 2.89
    },
    {
        asset_id: "3",
        symbol: "AAPL",
        name: "Apple Inc.",
        asset_type: "stock",
        quantity: 150,
        avg_cost: 21500,
        current_price: 21900,
        current_value: 3285000,
        unrealized_pnl: 60000,
        unrealized_pnl_percent: 1.86
    },
    {
        asset_id: "4",
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        asset_type: "stock",
        quantity: 75,
        avg_cost: 37200,
        current_price: 37980,
        current_value: 2848500,
        unrealized_pnl: 58500,
        unrealized_pnl_percent: 2.10
    }
]

export const mockAccountsData = [
    {
        id: "acc1",
        name: "Investment Account",
        type: "investment",
        balance: 8500000,
        institution: "SBI Securities",
        currency: "JPY"
    },
    {
        id: "acc2",
        name: "Crypto Wallet",
        type: "crypto",
        balance: 4131614,
        institution: "Binance",
        currency: "JPY"
    },
    {
        id: "acc3",
        name: "US Stock Account",
        type: "investment",
        balance: 6133500,
        institution: "Interactive Brokers",
        currency: "JPY"
    }
]

// バランス履歴
export interface BalanceHistory {
    month: string
    balance: number
}

export const mockBalanceHistory: BalanceHistory[] = [
    { month: "Jan", balance: 10200000 },
    { month: "Feb", balance: 10800000 },
    { month: "Mar", balance: 11200000 },
    { month: "Apr", balance: 11500000 },
    { month: "May", balance: 11900000 },
    { month: "Jun", balance: 12458932 },
]

// 支出内訳
export interface ExpenseCategory {
    category: string
    value: number
    color: string
}

export const mockExpenseBreakdown: ExpenseCategory[] = [
    { category: "Housing", value: 120000, color: "rgb(var(--chart-1))" },
    { category: "Food", value: 65000, color: "rgb(var(--chart-2))" },
    { category: "Transport", value: 45000, color: "rgb(var(--chart-3))" },
    { category: "Entertainment", value: 35000, color: "rgb(var(--chart-4))" },
    { category: "Others", value: 22540, color: "rgb(var(--chart-5))" },
]

// 月次データ
export interface MonthlyData {
    month: string
    income: number
    expense: number
    savings: number
}

export const mockMonthlyData: MonthlyData[] = [
    { month: "Jan", income: 420000, expense: 310000, savings: 110000 },
    { month: "Feb", income: 445000, expense: 295000, savings: 150000 },
    { month: "Mar", income: 438000, expense: 305000, savings: 133000 },
    { month: "Apr", income: 465000, expense: 285000, savings: 180000 },
    { month: "May", income: 452000, expense: 298000, savings: 154000 },
    { month: "Jun", income: 458000, expense: 287000, savings: 171000 },
]

// カテゴリー別支出
export interface CategorySpending {
    category: string
    amount: number
    percentage: number
}

export const mockCategorySpending: CategorySpending[] = [
    { category: "Housing", amount: 120000, percentage: 41.7 },
    { category: "Food", amount: 65000, percentage: 22.6 },
    { category: "Transport", amount: 45000, percentage: 15.6 },
    { category: "Entertainment", amount: 35000, percentage: 12.2 },
    { category: "Others", amount: 22540, percentage: 7.9 },
]

// ポートフォリオパフォーマンス
export interface PortfolioPerformance {
    month: string
    btc: number
    aapl: number
    googl: number
    eth: number
}

export const mockPortfolioPerformance: PortfolioPerformance[] = [
    { month: "Jan", btc: 2650000, aapl: 3100000, googl: 2700000, eth: 1150000 },
    { month: "Feb", btc: 2720000, aapl: 3180000, googl: 2750000, eth: 1200000 },
    { month: "Mar", btc: 2680000, aapl: 3220000, googl: 2780000, eth: 1180000 },
    { month: "Apr", btc: 2750000, aapl: 3250000, googl: 2800000, eth: 1220000 },
    { month: "May", btc: 2800000, aapl: 3270000, googl: 2820000, eth: 1260000 },
    { month: "Jun", btc: 2847293, aapl: 3284750, googl: 2847293, eth: 1284750 },
]

// 資産配分
export interface AssetAllocation {
    name: string
    value: number
    color: string
}

export const mockAssetAllocation: AssetAllocation[] = [
    { name: "Crypto", value: 4132043, color: "rgb(59, 130, 246)" },
    { name: "Stocks", value: 6132043, color: "rgb(139, 92, 246)" },
    { name: "Cash", value: 2194846, color: "rgb(34, 197, 94)" },
]

// トランザクション
export interface Transaction {
    id: number
    type: "income" | "expense"
    description: string
    amount: number
    date: string
    category: string
    status: "completed" | "pending" | "failed"
}

export const mockTransactions: Transaction[] = [
    {
        id: 1,
        type: "income",
        description: "Salary Payment",
        amount: 558320,
        date: "2024-06-15",
        category: "Income",
        status: "completed",
    },
    {
        id: 2,
        type: "expense",
        description: "Rent Payment",
        amount: -120000,
        date: "2024-06-14",
        category: "Housing",
        status: "completed",
    },
    {
        id: 3,
        type: "income",
        description: "Freelance Project",
        amount: 85000,
        date: "2024-06-12",
        category: "Income",
        status: "completed",
    },
    {
        id: 4,
        type: "expense",
        description: "Grocery Shopping",
        amount: -15420,
        date: "2024-06-11",
        category: "Food",
        status: "completed",
    },
    {
        id: 5,
        type: "expense",
        description: "Gas Station",
        amount: -8500,
        date: "2024-06-10",
        category: "Transport",
        status: "completed",
    },
    {
        id: 6,
        type: "income",
        description: "Investment Return",
        amount: 42000,
        date: "2024-06-09",
        category: "Investment",
        status: "completed",
    },
    {
        id: 7,
        type: "expense",
        description: "Restaurant",
        amount: -12800,
        date: "2024-06-08",
        category: "Food",
        status: "completed",
    },
    {
        id: 8,
        type: "expense",
        description: "Netflix Subscription",
        amount: -1980,
        date: "2024-06-07",
        category: "Entertainment",
        status: "completed",
    },
]

// マーケットデータ
export interface MarketData {
    symbol: string
    name: string
    price: number
    change: number
    change24h: number
    volume: string
    type: "crypto" | "stocks"
    /** TradingView用のティッカーシンボル */
    ticker: string
}

export const mockMarkets: MarketData[] = [
    {
        symbol: "BTC",
        name: "Bitcoin",
        price: 5440000,
        change: 2.34,
        change24h: 1.2,
        volume: "¥2.4T",
        type: "crypto",
        ticker: "BITSTAMP:BTCUSD"
    },
    {
        symbol: "ETH",
        name: "Ethereum",
        price: 391000,
        change: 3.21,
        change24h: 2.1,
        volume: "¥1.2T",
        type: "crypto",
        ticker: "BITSTAMP:ETHUSD"
    },
    {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 21900,
        change: -0.87,
        change24h: -0.3,
        volume: "¥890B",
        type: "stocks",
        ticker: "NASDAQ:AAPL"
    },
    {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: 37980,
        change: 1.45,
        change24h: 0.8,
        volume: "¥650B",
        type: "stocks",
        ticker: "NASDAQ:GOOGL"
    },
    {
        symbol: "SOL",
        name: "Solana",
        price: 18500,
        change: 5.67,
        change24h: 3.4,
        volume: "¥580B",
        type: "crypto",
        ticker: "BINANCE:SOLUSDT"
    },
    {
        symbol: "TSLA",
        name: "Tesla Inc.",
        price: 36950,
        change: -2.15,
        change24h: -1.5,
        volume: "¥720B",
        type: "stocks",
        ticker: "NASDAQ:TSLA"
    },
    {
        symbol: "MSFT",
        name: "Microsoft Corp.",
        price: 21850,
        change: 0.92,
        change24h: 0.4,
        volume: "¥810B",
        type: "stocks",
        ticker: "NASDAQ:MSFT"
    },
    {
        symbol: "BNB",
        name: "Binance Coin",
        price: 42300,
        change: 1.89,
        change24h: 1.1,
        volume: "¥420B",
        type: "crypto",
        ticker: "BINANCE:BNBUSDT"
    },
]
