/**
 * invest-data.js
 * 投資データの取得・管理に関する関数
 */

// サンプルのトランザクションデータを取得する関数
function getTransactionData() {
    // サンプルデータ（実際の実装ではサーバーから取得）
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    // 過去の日付を生成
    const getRandomPastDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };
    
    // BTC取引のサンプルデータ
    const transactions = [
        {
            id: '1',
            type: 'buy',
            asset: 'ビットコイン',
            assetCode: 'BTC',
            assetType: '暗号資産',
            quantity: 1,
            price: 1200000,
            date: formatDate(getRandomPastDate(oneYearAgo, today)),
            memo: '初めてのBTC購入'
        },
        {
            id: '2',
            type: 'buy',
            asset: 'ビットコイン',
            assetCode: 'BTC',
            assetType: '暗号資産',
            quantity: 1,
            price: 980000,
            date: formatDate(getRandomPastDate(oneYearAgo, today)),
            memo: '2回目のBTC購入'
        },
        {
            id: '3',
            type: 'sell',
            asset: 'ビットコイン',
            assetCode: 'BTC',
            assetType: '暗号資産',
            quantity: 1,
            price: 1500000,
            date: formatDate(getRandomPastDate(oneYearAgo, today)),
            memo: 'BTCの一部売却'
        },
        {
            id: '4',
            type: 'buy',
            asset: '米国株式インデックス',
            assetCode: 'VTI',
            assetType: 'ETF',
            quantity: 5,
            price: 20000,
            date: formatDate(getRandomPastDate(oneYearAgo, today)),
            memo: 'インデックス投資開始'
        },
        {
            id: '5',
            type: 'buy',
            asset: '国内債券',
            assetCode: '1482',
            assetType: '投資信託',
            quantity: 10,
            price: 10000,
            date: formatDate(getRandomPastDate(oneYearAgo, today)),
            memo: 'リスク分散のため'
        },
        {
            id: '6',
            type: 'buy',
            asset: '新興国株式',
            assetCode: 'VWO',
            assetType: 'ETF',
            quantity: 3,
            price: 15000,
            date: formatDate(getRandomPastDate(oneYearAgo, today)),
            memo: '新興国も少し'
        }
    ];
    
    return transactions;
}

// パフォーマンスデータを生成する関数
function generatePerformanceData(transactions, timeRange) {
    let startDate, endDate, interval, format;
    const now = new Date();
    
    // 期間に応じて設定を変更
    switch (timeRange) {
        case '1w':
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
            interval = 'day';
            format = { day: 'numeric' };
            break;
        case '1m':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 1);
            interval = 'day';
            format = { month: 'short', day: 'numeric' };
            break;
        case '3m':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 3);
            interval = 'week';
            format = { month: 'short', day: 'numeric' };
            break;
        case '6m':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 6);
            interval = 'week';
            format = { month: 'short', day: 'numeric' };
            break;
        case '1y':
            startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 1);
            interval = 'month';
            format = { year: 'numeric', month: 'short' };
            break;
        case '3y':
            startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 3);
            interval = 'quarter';
            format = { year: 'numeric', month: 'short' };
            break;
        case 'all':
            // 最初の取引日を開始日とする
            if (transactions.length > 0) {
                const dates = transactions.map(t => new Date(t.date));
                startDate = new Date(Math.min(...dates));
            } else {
                startDate = new Date(now);
                startDate.setFullYear(startDate.getFullYear() - 5);
            }
            interval = 'year';
            format = { year: 'numeric' };
            break;
        default:
            startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 1);
            interval = 'month';
            format = { year: 'numeric', month: 'short' };
    }
    
    endDate = now;
    
    // データポイントを生成
    const dataPoints = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        dataPoints.push({
            date: new Date(currentDate),
            label: currentDate.toLocaleDateString('ja-JP', format)
        });
        
        // 次のデータポイントへ
        switch (interval) {
            case 'day':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'quarter':
                currentDate.setMonth(currentDate.getMonth() + 3);
                break;
            case 'year':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
        }
    }
    
    // 各データポイントでの投資額と価値を計算
    const filteredTransactions = transactions.filter(t => 
        new Date(t.date) >= startDate && new Date(t.date) <= endDate
    );
    
    // 投資データと価値データの初期化
    const labels = dataPoints.map(dp => dp.label);
    const investmentData = Array(dataPoints.length).fill(0);
    const valueData = Array(dataPoints.length).fill(0);
    
    // 初期投資額（開始日以前の投資を集計）
    let initialInvestment = 0;
    let initialPositions = {};
    
    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate < startDate) {
            if (transaction.type === 'buy') {
                initialInvestment += transaction.quantity * transaction.price;
                
                // 資産ごとの初期保有数と価格を追跡
                if (!initialPositions[transaction.assetCode]) {
                    initialPositions[transaction.assetCode] = {
                        quantity: 0,
                        latestPrice: transaction.price
                    };
                }
                initialPositions[transaction.assetCode].quantity += transaction.quantity;
                initialPositions[transaction.assetCode].latestPrice = transaction.price;
            } else if (transaction.type === 'sell') {
                // 売却の場合、単純化のため購入価格で減額
                if (initialPositions[transaction.assetCode] && initialPositions[transaction.assetCode].quantity >= transaction.quantity) {
                    initialInvestment -= transaction.quantity * initialPositions[transaction.assetCode].latestPrice;
                    initialPositions[transaction.assetCode].quantity -= transaction.quantity;
                }
            }
        }
    });
    
    // 初期価値は初期投資額と同じと仮定（単純化）
    let currentInvestment = initialInvestment;
    let currentPositions = { ...initialPositions };
    
    // 各データポイントを処理
    for (let i = 0; i < dataPoints.length; i++) {
        const pointDate = dataPoints[i].date;
        let pointValue = 0;
        
        // このデータポイントまでの取引を処理
        const pointTransactions = filteredTransactions.filter(t => 
            new Date(t.date) <= pointDate
        );
        
        // 投資額と資産の更新
        pointTransactions.forEach(transaction => {
            // このデータポイント以前の取引だけを集計
            if (i > 0 && new Date(transaction.date) > dataPoints[i-1].date) {
                if (transaction.type === 'buy') {
                    currentInvestment += transaction.quantity * transaction.price;
                    
                    // 資産の保有数と最新価格を更新
                    if (!currentPositions[transaction.assetCode]) {
                        currentPositions[transaction.assetCode] = {
                            quantity: 0,
                            latestPrice: transaction.price
                        };
                    }
                    currentPositions[transaction.assetCode].quantity += transaction.quantity;
                    currentPositions[transaction.assetCode].latestPrice = transaction.price;
                } else if (transaction.type === 'sell') {
                    // 売却時は保有数を減らすが、投資額は平均取得単価に基づいて減額
                    if (currentPositions[transaction.assetCode] && currentPositions[transaction.assetCode].quantity >= transaction.quantity) {
                        // 実際の実装では平均取得単価の計算が必要
                        currentInvestment -= transaction.quantity * currentPositions[transaction.assetCode].latestPrice;
                        currentPositions[transaction.assetCode].quantity -= transaction.quantity;
                        currentPositions[transaction.assetCode].latestPrice = transaction.price;
                    }
                }
            }
        });
        
        // 価値の計算
        Object.keys(currentPositions).forEach(code => {
            const position = currentPositions[code];
            if (position.quantity > 0) {
                pointValue += position.quantity * position.latestPrice;
            }
        });
        
        // データを設定
        investmentData[i] = currentInvestment;
        valueData[i] = pointValue;
    }
    
    return {
        labels,
        investmentData,
        valueData
    };
}

// データを保存する関数（実際の実装ではサーバーに送信）
function saveTransaction(transaction) {
    console.log('Transaction saved:', transaction);
    // ローカルストレージに保存する例
    const transactions = getTransactionData();
    transactions.push({
        ...transaction,
        id: Date.now().toString()
    });
    
    // 実際の実装ではここでサーバーに送信
    return true;
}

// 取引を削除する関数
function deleteTransaction(transactionId) {
    console.log('Transaction deleted:', transactionId);
    // 実際の実装ではサーバーに送信
    return true;
}

// 価格更新を保存する関数
function saveAssetPrice(assetCode, price, date) {
    console.log('Price updated:', { assetCode, price, date });
    // 実際の実装ではサーバーに送信
    return true;
}

// フォーマット関連の関数
function formatCurrency(amount) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatQuantity(quantity) {
    // 整数の場合は小数点以下を表示しない
    if (Number.isInteger(quantity)) {
        return quantity.toString();
    }
    // 小数の場合は適切な桁数で表示
    return quantity.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '/');
}