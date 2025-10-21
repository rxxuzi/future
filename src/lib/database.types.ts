// ============================================
// Database Type Definitions (from SQL schema)
// ============================================

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    display_name: string | null
                    avatar_url: string | null
                    default_currency: string
                    timezone: string
                    language: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    display_name?: string | null
                    avatar_url?: string | null
                    default_currency?: string
                    timezone?: string
                    language?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    display_name?: string | null
                    avatar_url?: string | null
                    default_currency?: string
                    timezone?: string
                    language?: string
                    created_at?: string
                    updated_at?: string
                }
            }

            accounts: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    type: 'bank' | 'cash' | 'credit' | 'investment' | 'crypto' | 'other'
                    institution: string | null
                    account_number: string | null
                    balance: number
                    currency: string
                    is_active: boolean
                    is_excluded_from_total: boolean
                    display_order: number
                    color: string | null
                    icon: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    type: 'bank' | 'cash' | 'credit' | 'investment' | 'crypto' | 'other'
                    institution?: string | null
                    account_number?: string | null
                    balance?: number
                    currency?: string
                    is_active?: boolean
                    is_excluded_from_total?: boolean
                    display_order?: number
                    color?: string | null
                    icon?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['accounts']['Insert']>
            }

            assets: {
                Row: {
                    id: string
                    symbol: string
                    name: string
                    asset_type: 'stock' | 'crypto' | 'etf' | 'bond' | 'commodity' | 'forex' | 'other'
                    exchange: string | null
                    tradingview_symbol: string | null
                    coingecko_id: string | null
                    logo_url: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    symbol: string
                    name: string
                    asset_type: 'stock' | 'crypto' | 'etf' | 'bond' | 'commodity' | 'forex' | 'other'
                    exchange?: string | null
                    tradingview_symbol?: string | null
                    coingecko_id?: string | null
                    logo_url?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['assets']['Insert']>
            }

            asset_transactions: {
                Row: {
                    id: string
                    user_id: string
                    account_id: string
                    asset_id: string
                    transaction_type: 'buy' | 'sell' | 'dividend' | 'interest' | 'split' | 'transfer_in' | 'transfer_out' | 'fee'
                    quantity: number
                    price_per_unit: number | null
                    total_amount: number
                    fee: number
                    currency: string
                    transaction_date: string
                    status: 'pending' | 'completed' | 'cancelled'
                    notes: string | null
                    metadata: Record<string, any> | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    account_id: string
                    asset_id: string
                    transaction_type: 'buy' | 'sell' | 'dividend' | 'interest' | 'split' | 'transfer_in' | 'transfer_out' | 'fee'
                    quantity: number
                    price_per_unit?: number | null
                    total_amount: number
                    fee?: number
                    currency?: string
                    transaction_date: string
                    status?: 'pending' | 'completed' | 'cancelled'
                    notes?: string | null
                    metadata?: Record<string, any> | null
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['asset_transactions']['Insert']>
            }

            portfolio_summary: {
                Row: {
                    id: string
                    user_id: string
                    asset_id: string
                    total_quantity: number
                    average_buy_price: number | null
                    total_cost_basis: number
                    total_sold_quantity: number
                    average_sell_price: number | null
                    total_proceeds: number
                    realized_pnl: number
                    unrealized_pnl: number
                    total_pnl: number
                    realized_pnl_percent: number
                    unrealized_pnl_percent: number
                    total_pnl_percent: number
                    total_dividends: number
                    total_interest: number
                    total_fees: number
                    cost_currency: string
                    first_purchase_date: string | null
                    last_transaction_date: string | null
                    last_calculated_at: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    asset_id: string
                    total_quantity?: number
                    average_buy_price?: number | null
                    total_cost_basis?: number
                    total_sold_quantity?: number
                    average_sell_price?: number | null
                    total_proceeds?: number
                    realized_pnl?: number
                    unrealized_pnl?: number
                    total_pnl?: number
                    realized_pnl_percent?: number
                    unrealized_pnl_percent?: number
                    total_pnl_percent?: number
                    total_dividends?: number
                    total_interest?: number
                    total_fees?: number
                    cost_currency?: string
                    first_purchase_date?: string | null
                    last_transaction_date?: string | null
                    last_calculated_at?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['portfolio_summary']['Insert']>
            }

            asset_price_cache: {
                Row: {
                    asset_id: string
                    price: number
                    currency: string
                    change_24h: number | null
                    volume_24h: number | null
                    market_cap: number | null
                    updated_at: string
                }
                Insert: {
                    asset_id: string
                    price: number
                    currency?: string
                    change_24h?: number | null
                    volume_24h?: number | null
                    market_cap?: number | null
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['asset_price_cache']['Insert']>
            }

            categories: {
                Row: {
                    id: string
                    user_id: string | null
                    name: string
                    type: 'income' | 'expense'
                    parent_id: string | null
                    icon: string | null
                    color: string | null
                    display_order: number
                    is_active: boolean
                    is_system: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    name: string
                    type: 'income' | 'expense'
                    parent_id?: string | null
                    icon?: string | null
                    color?: string | null
                    display_order?: number
                    is_active?: boolean
                    is_system?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['categories']['Insert']>
            }

            transactions: {
                Row: {
                    id: string
                    user_id: string
                    account_id: string
                    category_id: string | null
                    type: 'income' | 'expense' | 'transfer'
                    amount: number
                    currency: string
                    to_account_id: string | null
                    exchange_rate: number | null
                    description: string | null
                    receipt_url: string | null
                    location: string | null
                    merchant: string | null
                    tags: string[] | null
                    transaction_date: string
                    status: 'pending' | 'completed' | 'cancelled'
                    is_recurring: boolean
                    recurring_interval: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | null
                    recurring_parent_id: string | null
                    metadata: Record<string, any> | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    account_id: string
                    category_id?: string | null
                    type: 'income' | 'expense' | 'transfer'
                    amount: number
                    currency?: string
                    to_account_id?: string | null
                    exchange_rate?: number | null
                    description?: string | null
                    receipt_url?: string | null
                    location?: string | null
                    merchant?: string | null
                    tags?: string[] | null
                    transaction_date?: string
                    status?: 'pending' | 'completed' | 'cancelled'
                    is_recurring?: boolean
                    recurring_interval?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | null
                    recurring_parent_id?: string | null
                    metadata?: Record<string, any> | null
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['transactions']['Insert']>
            }

            budgets: {
                Row: {
                    id: string
                    user_id: string
                    category_id: string | null
                    name: string
                    amount: number
                    currency: string
                    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
                    start_date: string
                    end_date: string | null
                    alert_threshold: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category_id?: string | null
                    name: string
                    amount: number
                    currency?: string
                    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
                    start_date: string
                    end_date?: string | null
                    alert_threshold?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['budgets']['Insert']>
            }

            goals: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    target_amount: number
                    current_amount: number
                    currency: string
                    deadline: string | null
                    category: string | null
                    priority: number
                    is_achieved: boolean
                    achieved_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    target_amount: number
                    current_amount?: number
                    currency?: string
                    deadline?: string | null
                    category?: string | null
                    priority?: number
                    is_achieved?: boolean
                    achieved_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['goals']['Insert']>
            }
        }
        Views: {
            v_user_portfolio: {
                Row: {
                    user_id: string
                    asset_id: string
                    symbol: string
                    name: string
                    asset_type: string
                    tradingview_symbol: string | null
                    total_quantity: number
                    average_buy_price: number | null
                    total_cost_basis: number
                    current_price: number | null
                    current_value: number | null
                    unrealized_pnl: number | null
                    unrealized_pnl_percent: number | null
                    realized_pnl: number | null
                    total_pnl: number | null
                    total_pnl_percent: number | null
                    total_dividends: number | null
                    change_24h: number | null
                    portfolio_weight_percent: number | null
                    first_purchase_date: string | null
                    last_transaction_date: string | null
                    last_calculated_at: string | null
                }
            }
            v_user_total_portfolio: {
                Row: {
                    user_id: string
                    total_assets: number
                    total_portfolio_value: number | null
                    total_cost: number | null
                    total_unrealized_pnl: number | null
                    total_realized_pnl: number | null
                    total_pnl: number | null
                    total_return_percent: number | null
                }
            }
        }
        Functions: {
            update_portfolio_summary: {
                Args: {
                    p_user_id: string
                    p_asset_id: string
                }
                Returns: void
            }
            create_portfolio_snapshot: {
                Args: {
                    p_user_id: string
                    p_snapshot_date: string
                }
                Returns: void
            }
        }
    }
}