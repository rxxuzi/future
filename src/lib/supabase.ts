import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'
import type { Database } from './database.types'

// ============================================
// Database Provider Interface
// ============================================
interface DatabaseProvider {
    from: (table: string) => any
    rpc: (fn: string, params?: any) => Promise<any>
    auth?: any
}

// ============================================
// Supabase Client
// ============================================
const createSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
    }

    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    })
}

// ============================================
// PostgreSQL Client (Local)
// ============================================
const createLocalClient = () => {
    const pool = new Pool({
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    })

    // Supabase互換のインターフェースを提供
    return {
        from: (table: string) => {
            return {
                select: async (columns = '*') => {
                    const query = `SELECT ${columns} FROM ${table}`
                    const result = await pool.query(query)
                    return { data: result.rows, error: null }
                },
                insert: async (data: any) => {
                    const keys = Object.keys(data)
                    const values = Object.values(data)
                    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',')

                    const query = `
            INSERT INTO ${table} (${keys.join(',')})
            VALUES (${placeholders})
            RETURNING *
          `

                    try {
                        const result = await pool.query(query, values)
                        return { data: result.rows[0], error: null }
                    } catch (error) {
                        return { data: null, error }
                    }
                },
                update: async (data: any) => {
                    const keys = Object.keys(data)
                    const values = Object.values(data)
                    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(',')

                    return {
                        eq: async (column: string, value: any) => {
                            values.push(value)
                            const query = `
                UPDATE ${table}
                SET ${setClause}
                WHERE ${column} = $${values.length}
                RETURNING *
              `

                            try {
                                const result = await pool.query(query, values)
                                return { data: result.rows, error: null }
                            } catch (error) {
                                return { data: null, error }
                            }
                        }
                    }
                },
                delete: async () => {
                    return {
                        eq: async (column: string, value: any) => {
                            const query = `DELETE FROM ${table} WHERE ${column} = $1 RETURNING *`

                            try {
                                const result = await pool.query(query, [value])
                                return { data: result.rows, error: null }
                            } catch (error) {
                                return { data: null, error }
                            }
                        }
                    }
                },
                upsert: async (data: any, { onConflict }: { onConflict?: string }) => {
                    const keys = Object.keys(data)
                    const values = Object.values(data)
                    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',')
                    const updateClause = keys
                        .filter(k => k !== onConflict)
                        .map(k => `${k} = EXCLUDED.${k}`)
                        .join(',')

                    const query = `
            INSERT INTO ${table} (${keys.join(',')})
            VALUES (${placeholders})
            ON CONFLICT (${onConflict || 'id'})
            DO UPDATE SET ${updateClause}
            RETURNING *
          `

                    try {
                        const result = await pool.query(query, values)
                        return { data: result.rows[0], error: null }
                    } catch (error) {
                        return { data: null, error }
                    }
                }
            }
        },
        rpc: async (fn: string, params?: any) => {
            const keys = params ? Object.keys(params) : []
            const values = params ? Object.values(params) : []
            const args = keys.map((k, i) => `${k} => $${i + 1}`).join(', ')

            const query = `SELECT * FROM ${fn}(${args})`

            try {
                const result = await pool.query(query, values)
                return { data: result.rows, error: null }
            } catch (error) {
                return { data: null, error }
            }
        }
    }
}

// ============================================
// Database Client Factory
// ============================================
const getDatabaseClient = (): DatabaseProvider => {
    const provider = process.env.DATABASE_PROVIDER || 'supabase'

    if (provider === 'supabase') {
        return createSupabaseClient()
    } else if (provider === 'local') {
        return createLocalClient()
    } else {
        throw new Error(`Unknown database provider: ${provider}`)
    }
}

// ============================================
// Export Client Instance
// ============================================
export const db = getDatabaseClient()

// ============================================
// Portfolio-specific Functions
// ============================================
export const portfolioService = {
    // 資産を取得
    async getAssets(userId: string) {
        const { data, error } = await db
            .from('v_user_portfolio')
            .select('*')
            .eq('user_id', userId)
            .order('current_value', { ascending: false })

        if (error) throw error
        return data
    },

    // 資産を追加
    async addAsset(data: {
        symbol: string
        name: string
        asset_type: 'stock' | 'crypto' | 'etf' | 'bond' | 'commodity' | 'forex' | 'other'
        exchange?: string
        tradingview_symbol?: string
    }) {
        const { data: asset, error } = await db
            .from('assets')
            .upsert(data, { onConflict: 'symbol' })
            .select()
            .single()

        if (error) throw error
        return asset
    },

    // トランザクションを記録
    async addTransaction(data: {
        user_id: string
        account_id: string
        asset_id: string
        transaction_type: 'buy' | 'sell' | 'dividend' | 'interest'
        quantity: number
        price_per_unit: number
        total_amount: number
        fee?: number
        transaction_date: string
        notes?: string
    }) {
        const { data: transaction, error } = await db
            .from('asset_transactions')
            .insert(data)
            .select()
            .single()

        if (error) throw error

        // ポートフォリオサマリーを更新
        await db.rpc('update_portfolio_summary', {
            p_user_id: data.user_id,
            p_asset_id: data.asset_id
        })

        return transaction
    },

    // ポートフォリオサマリーを取得
    async getPortfolioSummary(userId: string) {
        const { data, error } = await db
            .from('portfolio_summary')
            .select(`
        *,
        assets (
          symbol,
          name,
          asset_type,
          logo_url,
          tradingview_symbol
        )
      `)
            .eq('user_id', userId)
            .gt('total_quantity', 0)

        if (error) throw error
        return data
    },

    // 現在価格を更新
    async updateAssetPrice(assetId: string, price: number, change24h?: number) {
        const { error } = await db
            .from('asset_price_cache')
            .upsert({
                asset_id: assetId,
                price,
                change_24h: change24h,
                updated_at: new Date().toISOString()
            }, { onConflict: 'asset_id' })

        if (error) throw error
    },

    // 日次スナップショットを作成
    async createDailySnapshot(userId: string) {
        const { error } = await db.rpc('create_portfolio_snapshot', {
            p_user_id: userId,
            p_snapshot_date: new Date().toISOString().split('T')[0]
        })

        if (error) throw error
    },

    // パフォーマンスメトリクスを取得
    async getPerformanceMetrics(userId: string, period: string) {
        const { data, error } = await db
            .from('portfolio_performance')
            .select('*')
            .eq('user_id', userId)
            .eq('period', period)
            .order('calculation_date', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    }
}

export const transactionService = {
    // 日常の収支を記録
    async addTransaction(data: {
        user_id: string
        account_id: string
        category_id?: string
        type: 'income' | 'expense' | 'transfer'
        amount: number
        description?: string
        transaction_date: string
        to_account_id?: string
    }) {
        const { data: transaction, error } = await db
            .from('transactions')
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return transaction
    },

    // トランザクションを取得
    async getTransactions(userId: string, filters?: {
        startDate?: string
        endDate?: string
        type?: string
        categoryId?: string
    }) {
        let query = db
            .from('transactions')
            .select(`
        *,
        categories (
          name,
          icon,
          color
        ),
        accounts!account_id (
          name,
          type
        )
      `)
            .eq('user_id', userId)
            .order('transaction_date', { ascending: false })

        if (filters?.startDate) {
            query = query.gte('transaction_date', filters.startDate)
        }
        if (filters?.endDate) {
            query = query.lte('transaction_date', filters.endDate)
        }
        if (filters?.type) {
            query = query.eq('type', filters.type)
        }
        if (filters?.categoryId) {
            query = query.eq('category_id', filters.categoryId)
        }

        const { data, error } = await query

        if (error) throw error
        return data
    }
}

export const accountService = {
    // アカウントを作成
    async createAccount(data: {
        user_id: string
        name: string
        type: 'bank' | 'cash' | 'credit' | 'investment' | 'crypto' | 'other'
        balance?: number
        currency?: string
        institution?: string
    }) {
        const { data: account, error } = await db
            .from('accounts')
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return account
    },

    // アカウント一覧を取得
    async getAccounts(userId: string) {
        const { data, error } = await db
            .from('accounts')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        if (error) throw error
        return data
    },

    // アカウント残高を更新
    async updateBalance(accountId: string, balance: number) {
        const { error } = await db
            .from('accounts')
            .update({ balance, updated_at: new Date().toISOString() })
            .eq('id', accountId)

        if (error) throw error
    }
}

export type Asset = {
    id: string
    symbol: string
    name: string
    asset_type: string
    exchange?: string
    tradingview_symbol?: string
    logo_url?: string
}

export type PortfolioItem = {
    asset_id: string
    symbol: string
    name: string
    total_quantity: number
    average_buy_price: number
    total_cost_basis: number
    current_price?: number
    current_value?: number
    unrealized_pnl?: number
    unrealized_pnl_percent?: number
    realized_pnl?: number
    total_pnl?: number
    change_24h?: number
}

export type Transaction = {
    id: string
    type: string
    amount: number
    description?: string
    transaction_date: string
    category?: {
        name: string
        icon?: string
        color?: string
    }
    account?: {
        name: string
        type: string
    }
}