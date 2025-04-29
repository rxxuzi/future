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

    if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
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
        try {
            return await apiRequest(`transactions.php?year=${year}&month=${month}`);
        } catch (error) {
            console.error('月次トランザクションの取得に失敗しました:', error);
            // エラー時はローカルストレージからフォールバック
            return { transactions: getLocalTransactions(year, month) };
        }
    },

    // 全てのトランザクションを取得
    async getAllTransactions() {
        try {
            return await apiRequest('transactions.php?all=true');
        } catch (error) {
            console.error('全トランザクションの取得に失敗しました:', error);
            // エラー時はローカルストレージからフォールバック
            return { transactions: JSON.parse(localStorage.getItem('transactions')) || [] };
        }
    },

    // 新しいトランザクションを追加
    async addTransaction(transaction) {
        try {
            return await apiRequest('transactions.php', 'POST', transaction);
        } catch (error) {
            console.error('トランザクションの追加に失敗しました:', error);
            // エラー時はローカルストレージに保存
            saveLocalTransaction(transaction);
            return { transaction: { ...transaction, id: Date.now() } };
        }
    },

    // トランザクションを更新
    async updateTransaction(transaction) {
        try {
            return await apiRequest('transactions.php', 'PUT', transaction);
        } catch (error) {
            console.error('トランザクションの更新に失敗しました:', error);
            // エラー時はローカルストレージで更新
            updateLocalTransaction(transaction);
            return { transaction };
        }
    },

    // トランザクションを削除
    async deleteTransaction(id) {
        try {
            const result = await apiRequest('transactions.php', 'DELETE', { id });
            return result;
        } catch (error) {
            console.error('トランザクションの削除に失敗しました:', error);
            // エラー時はローカルストレージから削除
            deleteLocalTransaction(id);
            return { success: true };
        }
    },

    // ローカルデータをインポート（サーバー接続時）
    async syncLocalData() {
        const localTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        if (localTransactions.length === 0) return;

        try {
            // 一度に全てのトランザクションを送信
            const response = await fetch(`${API_BASE_PATH}/bulk_import.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ transactions: localTransactions })
            });

            if (response.ok) {
                // 同期成功したらローカルデータをクリア
                localStorage.removeItem('transactions');
                console.log('ローカルデータをサーバーと同期しました');
                return true;
            }
            return false;
        } catch (error) {
            console.error('ローカルデータの同期に失敗しました:', error);
            return false;
        }
    }
};

// カテゴリ関連のAPI関数
const categoriesAPI = {
    // カテゴリを取得（タイプでフィルター可能）
    async getCategories(type = null) {
        try {
            const endpoint = type ? `categories.php?type=${type}` : 'categories.php';
            return await apiRequest(endpoint);
        } catch (error) {
            console.error('カテゴリの取得に失敗しました:', error);
            // エラー時はローカルストレージからフォールバック
            const localCategories = type ?
                JSON.parse(localStorage.getItem(`${type}Categories`)) || [] :
                {
                    income: JSON.parse(localStorage.getItem('incomeCategories')) || [],
                    expense: JSON.parse(localStorage.getItem('expenseCategories')) || []
                };
            return { categories: localCategories };
        }
    },

    // 新しいカテゴリを追加
    async addCategory(type, name, color) {
        try {
            return await apiRequest('categories.php', 'POST', { type, name, color });
        } catch (error) {
            console.error('カテゴリの追加に失敗しました:', error);
            // エラー時はローカルストレージに保存
            addLocalCategory(type, name);
            return { success: true };
        }
    },

    // カテゴリを削除
    async deleteCategory(id, type, name) {
        try {
            return await apiRequest('categories.php', 'DELETE', { id });
        } catch (error) {
            console.error('カテゴリの削除に失敗しました:', error);
            // エラー時はローカルストレージから削除
            deleteLocalCategory(type, name);
            return { success: true };
        }
    }
};

// 貯蓄目標関連のAPI関数
const savingsAPI = {
    // 貯蓄目標を取得
    async getSavingsTarget() {
        try {
            return await apiRequest('savings.php');
        } catch (error) {
            console.error('貯蓄目標の取得に失敗しました:', error);
            // エラー時はローカルストレージからフォールバック
            const target = {
                name: '総貯蓄目標',
                target_amount: localStorage.getItem('savingsTarget') || 3000000,
                current_amount: 0
            };
            return { target };
        }
    },

    // 貯蓄目標を更新
    async updateSavingsTarget(target) {
        try {
            return await apiRequest('savings.php', 'PUT', { target });
        } catch (error) {
            console.error('貯蓄目標の更新に失敗しました:', error);
            // エラー時はローカルストレージに保存
            localStorage.setItem('savingsTarget', target.target_amount.toString());
            return { success: true, target };
        }
    }
};

// ローカルストレージ操作用のヘルパー関数（オフライン時やエラー時のフォールバック用）
function getLocalTransactions(year, month) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    if (!year || !month) return transactions;

    // 指定した年月でフィルタリング
    return transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
}

function saveLocalTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const newTransaction = {
        ...transaction,
        id: Date.now(),
        timestamp: new Date().toISOString()
    };
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return newTransaction;
}

function updateLocalTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const index = transactions.findIndex(t => t.id === transaction.id);

    if (index !== -1) {
        transactions[index] = {
            ...transactions[index],
            ...transaction,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
}

function deleteLocalTransaction(id) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addLocalCategory(type, name) {
    const key = `${type}Categories`;
    let categories = JSON.parse(localStorage.getItem(key)) || [];
    if (!categories.includes(name)) {
        categories.push(name);
        localStorage.setItem(key, JSON.stringify(categories));
    }
}

function deleteLocalCategory(type, name) {
    const key = `${type}Categories`;
    let categories = JSON.parse(localStorage.getItem(key)) || [];
    categories = categories.filter(category => category !== name);
    localStorage.setItem(key, JSON.stringify(categories));
}

// オンライン状態を検出し、ローカルデータの同期を試みる
window.addEventListener('online', async () => {
    console.log('オンラインになりました。ローカルデータの同期を試みます...');
    await transactionsAPI.syncLocalData();
});

// APIを公開
window.api = {
    transactions: transactionsAPI,
    categories: categoriesAPI,
    savings: savingsAPI
};