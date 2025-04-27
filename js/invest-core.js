/**
 * invest-core.js
 * 投資計算の中核となる関数
 */

// 投資データを読み込む関数
function loadInvestmentData(timeRange) {
    // トランザクションデータの取得
    const transactions = getTransactionData();
    
    // 保有ポジションの計算
    const positions = calculatePositions(transactions);
    
    // 投資概要の更新
    updateInvestmentSummary(positions);
    
    // 資産配分チャートの更新
    updateAssetAllocationChart(positions);
    
    // 投資パフォーマンスチャートの更新
    updateInvestmentPerformanceChart(transactions, timeRange);
    
    // ポートフォリオのポジション一覧を更新
    updatePositionsTable(positions);
    
    // 取引履歴テーブルを更新
    updateTransactionsTable(transactions);
    
    // 資産パフォーマンステーブルを更新
    updateAssetPerformanceTable(positions, transactions);
    
    // 貯蓄への貢献を更新
    updateSavingsContribution(positions, transactions);
    
    // 資産選択リストを更新
    updateAssetSelector(positions);
}

// 保有ポジションを計算する関数
function calculatePositions(transactions) {
    const positions = {};
    
    // トランザクションを日付順にソート
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    // 各トランザクションを処理
    sortedTransactions.forEach(transaction => {
        const { asset, assetCode, assetType, type, quantity, price, date } = transaction;
        
        // 資産がまだ登録されていなければ初期化
        if (!positions[assetCode]) {
            positions[assetCode] = {
                name: asset,
                code: assetCode,
                type: assetType,
                quantity: 0,
                totalCost: 0,
                currentPrice: 0,
                lastUpdateDate: null,
                transactions: []
            };
        }
        
        // トランザクション情報を保存
        positions[assetCode].transactions.push(transaction);
        
        // 購入の場合
        if (type === 'buy') {
            positions[assetCode].quantity += quantity;
            positions[assetCode].totalCost += quantity * price;
        }
        // 売却の場合
        else if (type === 'sell') {
            // 売却による利益/損失は記録するが、ここでは計算しない
            positions[assetCode].quantity -= quantity;
            
            // 平均取得単価を維持したまま総コストを減らす
            if (positions[assetCode].quantity > 0) {
                const avgCost = positions[assetCode].totalCost / (positions[assetCode].quantity + quantity);
                positions[assetCode].totalCost = avgCost * positions[assetCode].quantity;
            } else {
                positions[assetCode].totalCost = 0;
            }
        }
        
        // 現在価格の更新（最新のトランザクションの価格を使用）
        if (!positions[assetCode].lastUpdateDate || new Date(date) > new Date(positions[assetCode].lastUpdateDate)) {
            positions[assetCode].currentPrice = price;
            positions[assetCode].lastUpdateDate = date;
        }
    });
    
    // 平均取得単価と現在価値、利益などを計算
    Object.keys(positions).forEach(code => {
        const position = positions[code];
        
        // 平均取得単価
        position.avgCost = position.quantity > 0 ? position.totalCost / position.quantity : 0;
        
        // 現在価値
        position.currentValue = position.quantity * position.currentPrice;
        
        // 損益
        position.profit = position.currentValue - position.totalCost;
        
        // リターン率
        position.returnRate = position.totalCost > 0 ? (position.profit / position.totalCost) * 100 : 0;
    });
    
    return positions;
}

// 特定の期間のパフォーマンスを計算する関数
function calculatePerformanceForPeriod(position, transactions, period) {
    // 期間の開始日を計算
    const now = new Date();
    let startDate;
    
    switch (period) {
        case '1w':
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '1m':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case '3m':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 3);
            break;
        case '6m':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 6);
            break;
        case '1y':
            startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        case '3y':
            startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 3);
            break;
        case 'all':
            startDate = new Date(0); // 1970年から
            break;
        default:
            startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    // この資産の取引だけフィルター
    const assetTransactions = transactions.filter(t => t.assetCode === position.code);
    
    // 期間開始時点の価格を見つける
    let startPrice = 0;
    
    // 期間開始日より前の最新の取引を探す
    const pastTransactions = assetTransactions.filter(t => new Date(t.date) <= startDate);
    if (pastTransactions.length > 0) {
        // 日付でソートして最新のものを取得
        pastTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        startPrice = pastTransactions[0].price;
    } else if (assetTransactions.length > 0) {
        // 過去の取引がなければ最初の取引の価格を使用
        assetTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        startPrice = assetTransactions[0].price;
    }
    
    // 開始価格がゼロならパフォーマンスも計算できない
    if (startPrice === 0) {
        return 0;
    }
    
    // パフォーマンスを計算
    const currentPrice = position.currentPrice;
    const performance = ((currentPrice - startPrice) / startPrice) * 100;
    
    return performance;
}

// 取引に関連する計算
function calculateTransactionAmount(quantity, price) {
    return quantity * price;
}