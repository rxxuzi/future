/**
 * invest-ui.js
 * 投資データの表示・UI操作に関する関数
 */

document.addEventListener('DOMContentLoaded', function() {
    // 日付範囲の変更イベント
    document.getElementById('date-range').addEventListener('change', function() {
        loadInvestmentData(this.value);
    });
    
    // 取引追加ボタンのイベント
    document.getElementById('add-transaction-btn').addEventListener('click', function() {
        openTransactionModal();
    });
    
    // ポートフォリオタブの切り替え
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    portfolioTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // アクティブタブの切り替え
            portfolioTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // タブコンテンツの切り替え
            const tabName = this.dataset.tab;
            document.querySelectorAll('.portfolio-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
    
    // 数量と価格から合計金額を自動計算
    document.getElementById('transaction-quantity').addEventListener('input', calculateAmount);
    document.getElementById('transaction-price').addEventListener('input', calculateAmount);
    
    // 資産選択の変更イベント
    document.getElementById('asset-selector').addEventListener('change', function() {
        const newAssetForm = document.getElementById('new-asset-form');
        if (this.value === 'new') {
            newAssetForm.style.display = 'block';
            document.getElementById('asset-name').required = true;
            document.getElementById('asset-code').required = true;
        } else {
            newAssetForm.style.display = 'none';
            document.getElementById('asset-name').required = false;
            document.getElementById('asset-code').required = false;
        }
    });
    
    // モーダル関連の処理
    setupModals();
    
    // 初期データの読み込み
    loadInvestmentData('1y');
});

// 取引フォームの合計金額を計算する関数
function calculateAmount() {
    const quantity = parseFloat(document.getElementById('transaction-quantity').value) || 0;
    const price = parseFloat(document.getElementById('transaction-price').value) || 0;
    const amount = calculateTransactionAmount(quantity, price);
    document.getElementById('transaction-amount').value = amount.toFixed(2);
}

// 投資概要を更新する関数
function updateInvestmentSummary(positions) {
    let totalInvestment = 0;
    let currentValue = 0;
    
    // 全ポジションの合計を計算
    Object.values(positions).forEach(position => {
        totalInvestment += position.totalCost;
        currentValue += position.currentValue;
    });
    
    const totalProfit = currentValue - totalInvestment;
    const totalReturn = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
    
    // 表示更新
    document.getElementById('total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('current-investment-value').textContent = formatCurrency(currentValue);
    document.getElementById('total-profit').textContent = formatCurrency(totalProfit);
    document.getElementById('total-return').textContent = totalReturn.toFixed(1) + '%';
    
    // 収益がマイナスの場合はlossクラスを追加
    if (totalProfit < 0) {
        document.getElementById('total-profit').classList.remove('profit');
        document.getElementById('total-profit').classList.add('loss');
    } else {
        document.getElementById('total-profit').classList.add('profit');
        document.getElementById('total-profit').classList.remove('loss');
    }
    
    if (totalReturn < 0) {
        document.getElementById('total-return').classList.remove('profit');
        document.getElementById('total-return').classList.add('loss');
    } else {
        document.getElementById('total-return').classList.add('profit');
        document.getElementById('total-return').classList.remove('loss');
    }
}

// 資産配分チャートを更新する関数
function updateAssetAllocationChart(positions) {
    const ctx = document.getElementById('assetAllocationChart').getContext('2d');
    
    // 既存のチャートがあれば破棄
    if (window.assetAllocationChart instanceof Chart) {
        window.assetAllocationChart.destroy();
    }
    
    // 資産タイプごとの集計
    const assetTypeValues = {};
    
    Object.values(positions).forEach(position => {
        if (position.currentValue > 0) {
            if (assetTypeValues[position.type]) {
                assetTypeValues[position.type] += position.currentValue;
            } else {
                assetTypeValues[position.type] = position.currentValue;
            }
        }
    });
    
    // チャートデータの準備
    const labels = Object.keys(assetTypeValues);
    const data = Object.values(assetTypeValues);
    
    // 色の生成
    const colors = [
        '#4f46e5', // インディゴ
        '#0ea5e9', // スカイブルー
        '#10b981', // エメラルド
        '#f59e0b', // アンバー
        '#ef4444', // レッド
        '#8b5cf6', // パープル
        '#ec4899'  // ピンク
    ];
    
    // チャートの作成
    window.assetAllocationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// 投資パフォーマンスチャートを更新する関数
function updateInvestmentPerformanceChart(transactions, timeRange) {
    const ctx = document.getElementById('investmentPerformanceChart').getContext('2d');
    
    // 既存のチャートがあれば破棄
    if (window.investmentPerformanceChart instanceof Chart) {
        window.investmentPerformanceChart.destroy();
    }
    
    // 期間に基づいてデータを生成
    const chartData = generatePerformanceData(transactions, timeRange);
    
    // チャートの作成
    window.investmentPerformanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: '投資額',
                    data: chartData.investmentData,
                    borderColor: '#64748b',
                    backgroundColor: 'rgba(100, 116, 139, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: '現在価値',
                    data: chartData.valueData,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderWidth: 3,
                    pointRadius: 0,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw;
                            return `${label}: ${formatCurrency(value)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                },
                y: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// ポジションテーブルを更新する関数
function updatePositionsTable(positions) {
    const tableBody = document.getElementById('portfolio-positions-body');
    tableBody.innerHTML = '';
    
    Object.values(positions).forEach(position => {
        // 保有数がゼロのポジションは非表示にする選択肢もあり
        // if (position.quantity <= 0) return;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="investment-name">${position.name}</div>
                <div class="investment-code">${position.code}</div>
            </td>
            <td>${position.type}</td>
            <td>${formatCurrency(position.avgCost)}</td>
            <td>${formatCurrency(position.currentPrice)}</td>
            <td>${formatQuantity(position.quantity)}</td>
            <td>${formatCurrency(position.totalCost)}</td>
            <td>${formatCurrency(position.currentValue)}</td>
            <td class="${position.profit >= 0 ? 'profit' : 'loss'}">${formatCurrency(position.profit)}</td>
            <td class="${position.returnRate >= 0 ? 'profit' : 'loss'}">${position.returnRate.toFixed(1)}%</td>
            <td>
                <button class="btn-icon update-price" data-code="${position.code}">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 価格更新ボタンのイベント設定
    setupUpdatePriceButtons();
}

// 取引履歴テーブルを更新する関数
function updateTransactionsTable(transactions) {
    const tableBody = document.getElementById('portfolio-transactions-body');
    tableBody.innerHTML = '';
    
    // 最新の取引を先頭に表示
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.type === 'buy' ? '購入' : '売却'}</td>
            <td>
                <div class="investment-name">${transaction.asset}</div>
                <div class="investment-code">${transaction.assetCode}</div>
            </td>
            <td>${formatQuantity(transaction.quantity)}</td>
            <td>${formatCurrency(transaction.price)}</td>
            <td>${formatCurrency(transaction.quantity * transaction.price)}</td>
            <td>${transaction.memo || '-'}</td>
            <td>
                <button class="btn-icon edit-transaction" data-id="${transaction.id}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 編集ボタンのイベント設定
    setupEditTransactionButtons();
}

// 資産パフォーマンステーブルを更新する関数
function updateAssetPerformanceTable(positions, transactions) {
    const tableBody = document.getElementById('asset-performance-body');
    tableBody.innerHTML = '';
    
    // 有効な資産だけ抽出（保有数が0より大きい）
    const activePositions = Object.values(positions).filter(position => position.quantity > 0);
    
    // パフォーマンス期間
    const periods = ['1w', '1m', '3m', '6m', '1y', '3y', 'all'];
    
    activePositions.forEach(position => {
        const row = document.createElement('tr');
        
        let cellsHtml = `
            <td>
                <div class="investment-name">${position.name}</div>
                <div class="investment-code">${position.code}</div>
            </td>
        `;
        
        // 各期間のパフォーマンスを計算
        periods.forEach(period => {
            const performance = calculatePerformanceForPeriod(position, transactions, period);
            const performanceClass = performance >= 0 ? 'profit' : 'loss';
            
            cellsHtml += `<td class="${performanceClass}">${performance.toFixed(1)}%</td>`;
        });
        
        row.innerHTML = cellsHtml;
        tableBody.appendChild(row);
    });
}

// 貯蓄への貢献を更新する関数
function updateSavingsContribution(positions, transactions) {
    // 投資による貯蓄額（現在価値の合計）
    const investmentSavings = Object.values(positions).reduce((sum, position) => sum + position.currentValue, 0);
    
    // 現金貯蓄額（サンプルデータ - 実際の実装ではサーバーから取得）
    const cashSavings = 950000;
    
    // 総貯蓄額
    const totalSavings = investmentSavings + cashSavings;
    
    // 表示更新
    document.getElementById('investment-savings').textContent = formatCurrency(investmentSavings);
    document.getElementById('cash-savings').textContent = formatCurrency(cashSavings);
    document.getElementById('total-savings').textContent = formatCurrency(totalSavings);
    
    // 貯蓄貢献チャートの更新
    updateSavingsContributionChart(investmentSavings, cashSavings);
}

// 貯蓄貢献チャートを更新する関数
function updateSavingsContributionChart(investmentSavings, cashSavings) {
    const ctx = document.getElementById('savingsContributionChart').getContext('2d');
    
    // 既存のチャートがあれば破棄
    if (window.savingsContributionChart instanceof Chart) {
        window.savingsContributionChart.destroy();
    }
    
    // チャートデータ
    const data = [investmentSavings, cashSavings];
    const labels = ['投資による貯蓄', '現金貯蓄'];
    const colors = ['#4f46e5', '#10b981'];
    
    // チャートの作成
    window.savingsContributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 資産選択リストを更新する関数
function updateAssetSelector(positions) {
    const selector = document.getElementById('asset-selector');
    
    // 既存のオプションをクリア（「新規資産を追加」以外）
    const existingOptions = selector.querySelectorAll('option:not([value="new"])');
    existingOptions.forEach(option => option.remove());
    
    // 資産ごとにオプションを追加
    Object.values(positions).forEach(position => {
        const option = document.createElement('option');
        option.value = position.code;
        option.textContent = `${position.name} (${position.code})`;
        selector.appendChild(option);
    });
    
    // デフォルトで「新規資産を追加」を選択
    selector.value = 'new';
    
    // 新規資産フォームを表示
    document.getElementById('new-asset-form').style.display = 'block';
}

// 取引追加モーダルを開く関数
function openTransactionModal(transactionId = null) {
    const modal = document.getElementById('transaction-modal');
    const form = document.getElementById('transaction-form');
    const modalTitle = document.getElementById('transaction-modal-title');
    const deleteBtn = document.getElementById('delete-transaction');
    
    // フォームをリセット
    form.reset();
    
    if (transactionId) {
        // 編集モードの場合は既存データを設定
        modalTitle.textContent = '取引を編集';
        deleteBtn.style.display = 'block';
        
        // サンプルデータから該当する取引を取得（実際の実装ではサーバーから取得）
        const transactions = getTransactionData();
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (transaction) {
            // フォームに値をセット
            document.getElementById('transaction-id').value = transaction.id;
            document.getElementById('transaction-type').value = transaction.type;
            document.getElementById('asset-selector').value = transaction.assetCode;
            
            // 既存の資産を選択した場合は新規資産フォームを非表示に
            if (transaction.assetCode !== 'new') {
                document.getElementById('new-asset-form').style.display = 'none';
                document.getElementById('asset-name').required = false;
                document.getElementById('asset-code').required = false;
            } else {
                document.getElementById('asset-name').value = transaction.asset;
                document.getElementById('asset-code').value = transaction.assetCode;
                document.getElementById('asset-type').value = transaction.assetType;
            }
            
            document.getElementById('transaction-quantity').value = transaction.quantity;
            document.getElementById('transaction-price').value = transaction.price;
            document.getElementById('transaction-amount').value = (transaction.quantity * transaction.price).toFixed(2);
            document.getElementById('transaction-date').value = transaction.date;
            document.getElementById('transaction-memo').value = transaction.memo || '';
        }
    } else {
        // 追加モードの場合
        modalTitle.textContent = '取引を追加';
        deleteBtn.style.display = 'none';
        document.getElementById('transaction-id').value = '';
        document.getElementById('transaction-date').valueAsDate = new Date();
    }
    
    // モーダルを表示
    modal.style.display = 'flex';
}

// 価格更新モーダルを開く関数
function openPriceUpdateModal(assetCode) {
    const modal = document.getElementById('price-update-modal');
    const form = document.getElementById('price-update-form');
    
    // フォームをリセット
    form.reset();
    
    // 資産データを取得（実際の実装ではサーバーから取得）
    const positions = calculatePositions(getTransactionData());
    const asset = positions[assetCode];
    
    if (asset) {
        // フォームに値をセット
        document.getElementById('update-asset-id').value = assetCode;
        document.getElementById('update-asset-name').value = asset.name;
        document.getElementById('update-current-price').value = asset.currentPrice;
        document.getElementById('update-date').valueAsDate = new Date();
    }
    
    // モーダルを表示
    modal.style.display = 'flex';
}

// 価格更新ボタンのイベント設定関数
function setupUpdatePriceButtons() {
    const updateButtons = document.querySelectorAll('.update-price');
    
    updateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assetCode = this.dataset.code;
            openPriceUpdateModal(assetCode);
        });
    });
}

// 取引編集ボタンのイベント設定関数
function setupEditTransactionButtons() {
    const editButtons = document.querySelectorAll('.edit-transaction');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.dataset.id;
            openTransactionModal(transactionId);
        });
    });
}

// モーダル関連の処理設定関数
function setupModals() {
    // 取引モーダル
    const transactionModal = document.getElementById('transaction-modal');
    const closeTransactionModal = transactionModal.querySelector('.close-modal');
    const transactionForm = document.getElementById('transaction-form');
    const deleteTransactionBtn = document.getElementById('delete-transaction');
    
    // 価格更新モーダル
    const priceModal = document.getElementById('price-update-modal');
    const closePriceModal = priceModal.querySelector('.close-modal');
    const priceForm = document.getElementById('price-update-form');
    
    // 取引モーダルを閉じる
    closeTransactionModal.addEventListener('click', function() {
        transactionModal.style.display = 'none';
    });
    
    // 価格更新モーダルを閉じる
    closePriceModal.addEventListener('click', function() {
        priceModal.style.display = 'none';
    });
    
    // モーダル外をクリックしても閉じる
    window.addEventListener('click', function(event) {
        if (event.target === transactionModal) {
            transactionModal.style.display = 'none';
        }
        if (event.target === priceModal) {
            priceModal.style.display = 'none';
        }
    });
    
    // 取引フォームの送信処理
    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータの取得
        const transactionId = document.getElementById('transaction-id').value;
        const type = document.getElementById('transaction-type').value;
        const assetSelector = document.getElementById('asset-selector').value;
        const quantity = parseFloat(document.getElementById('transaction-quantity').value);
        const price = parseFloat(document.getElementById('transaction-price').value);
        const date = document.getElementById('transaction-date').value;
        const memo = document.getElementById('transaction-memo').value;
        
        let asset, assetCode, assetType;
        
        if (assetSelector === 'new') {
            // 新規資産の場合
            asset = document.getElementById('asset-name').value;
            assetCode = document.getElementById('asset-code').value;
            assetType = document.getElementById('asset-type').value;
        } else {
            // 既存資産の場合
            const positions = calculatePositions(getTransactionData());
            const position = positions[assetSelector];
            asset = position.name;
            assetCode = position.code;
            assetType = position.type;
        }
        
        // トランザクションデータの作成
        const transaction = {
            id: transactionId || Date.now().toString(),
            type,
            asset,
            assetCode,
            assetType,
            quantity,
            price,
            date,
            memo
        };
        
        // トランザクションの保存
        saveTransaction(transaction);
        
        // モーダルを閉じる
        transactionModal.style.display = 'none';
        
        // データの再読み込み
        loadInvestmentData(document.getElementById('date-range').value);
    });
    
    // 取引削除ボタンの処理
    deleteTransactionBtn.addEventListener('click', function() {
        if (confirm('この取引を削除してもよろしいですか？')) {
            const transactionId = document.getElementById('transaction-id').value;
            
            // トランザクションの削除
            deleteTransaction(transactionId);
            
            // モーダルを閉じる
            transactionModal.style.display = 'none';
            
            // データの再読み込み
            loadInvestmentData(document.getElementById('date-range').value);
        }
    });
    
    // 価格更新フォームの送信処理
    priceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータの取得
        const assetCode = document.getElementById('update-asset-id').value;
        const currentPrice = parseFloat(document.getElementById('update-current-price').value);
        const updateDate = document.getElementById('update-date').value;
        
        // 価格の更新を保存
        saveAssetPrice(assetCode, currentPrice, updateDate);
        
        // モーダルを閉じる
        priceModal.style.display = 'none';
        
        // データの再読み込み
        loadInvestmentData(document.getElementById('date-range').value);
    });
}