// api.js - APIリクエスト用の共通関数

// 基本的なAPIパス
const API_BASE_PATH = 'api';

// 共通のAPIリクエスト関数
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_PATH}/${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // セッションCookieを送信
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        // エラーレスポンスの場合
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `APIリクエストエラー: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('APIリクエストエラー:', error);
        throw error;
    }
}

// トランザクション関連のAPI関数
const transactionsAPI = {
    // 特定月のトランザクションを取得
    async getMonthlyTransactions(year, month) {
        return await apiRequest(`transactions.php?year=${year}&month=${month}`);
    },

    // 全てのトランザクションを取得
    async getAllTransactions() {
        return await apiRequest('transactions.php?all=true');
    },

    // 新しいトランザクションを追加
    async addTransaction(transaction) {
        return await apiRequest('transactions.php', 'POST', transaction);
    },

    // トランザクションを更新
    async updateTransaction(transaction) {
        return await apiRequest('transactions.php', 'PUT', transaction);
    },

    // トランザクションを削除
    async deleteTransaction(id) {
        return await apiRequest('transactions.php', 'DELETE', { id });
    }
};

// カテゴリ関連のAPI関数
const categoriesAPI = {
    // カテゴリを取得（タイプでフィルター可能）
    async getCategories(type = null) {
        const endpoint = type ? `categories.php?type=${type}` : 'categories.php';
        return await apiRequest(endpoint);
    }
};

// 貯蓄目標関連のAPI関数
const savingsAPI = {
    // 貯蓄目標を取得
    async getSavingsTarget() {
        return await apiRequest('savings.php');
    },

    // 貯蓄目標を更新
    async updateSavingsTarget(target) {
        return await apiRequest('savings.php', 'PUT', { target });
    }
};

// APIを公開
window.api = {
    transactions: transactionsAPI,
    categories: categoriesAPI,
    savings: savingsAPI
};