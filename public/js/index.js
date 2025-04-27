// index.js - ダッシュボード固有の機能
document.addEventListener('DOMContentLoaded', function() {
    // グローバル関数が存在しない場合のフォールバック
    if (!window.getFilteredTransactions) {
        window.getFilteredTransactions = function() {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const currentYear = window.appState ? window.appState.currentYear : new Date().getFullYear();
            const currentMonth = window.appState ? window.appState.currentMonth : new Date().getMonth();

            const startDate = new Date(currentYear, currentMonth, 1);
            const endDate = new Date(currentYear, currentMonth + 1, 0);

            return transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        };
    }

    // フォーマット関数も確保
    if (!window.formatCurrency) {
        window.formatCurrency = function(amount) {
            return new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };
    }

    // グローバルステートが存在しない場合の初期化
    if (!window.appState) {
        window.appState = {
            currentDate: new Date(),
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth()
        };
    }

    // 初期データのロード
    loadDashboardData();

    // 日付変更イベントを監視
    document.addEventListener('dateChanged', function() {
        loadDashboardData();
    });

    // 取引変更イベントを監視
    document.addEventListener('transactionsChanged', function() {
        loadDashboardData();
    });

    // ダッシュボードデータを読み込む
    function loadDashboardData() {
        // 現在の月のトランザクションを取得
        const filteredTransactions = window.getFilteredTransactions();
        // 全期間のトランザクションを取得
        const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];

        // 残高サマリーを更新
        updateBalanceSummary(filteredTransactions);

        // 貯蓄サマリーを更新（全期間）
        updateSavingsSummary(allTransactions);

        // 最近の取引を更新
        updateRecentTransactions(filteredTransactions);

        // チャートを更新
        updateCharts(filteredTransactions, allTransactions);
    }

    // 残高サマリーを更新
    function updateBalanceSummary(transactions) {
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            if (transaction.amount > 0) {
                totalIncome += transaction.amount;
            } else {
                totalExpense += Math.abs(transaction.amount);
            }
        });

        const currentBalance = totalIncome - totalExpense;

        // 表示更新
        const currentBalanceEl = document.getElementById('current-balance');
        const totalIncomeEl = document.getElementById('total-income');
        const totalExpenseEl = document.getElementById('total-expense');

        if (currentBalanceEl) currentBalanceEl.textContent = window.formatCurrency(currentBalance);
        if (totalIncomeEl) totalIncomeEl.textContent = window.formatCurrency(totalIncome);
        if (totalExpenseEl) totalExpenseEl.textContent = window.formatCurrency(totalExpense);
    }

    // 貯蓄サマリーを更新（全期間）
    function updateSavingsSummary(transactions) {
        let totalSavings = 0;

        // 全期間の収支を計算
        transactions.forEach(transaction => {
            totalSavings += transaction.amount;
        });

        // 目標貯蓄額を取得（ローカルストレージから）
        const savingsTarget = parseInt(localStorage.getItem('savingsTarget')) || 3000000;
        const progress = totalSavings > 0 ? (totalSavings / savingsTarget) * 100 : 0;
        const clampedProgress = Math.min(progress, 100); // 進捗率は100%を超えないように

        // 表示更新
        const totalSavingsAmountEl = document.getElementById('total-savings-amount');
        const savingsTargetTextEl = document.getElementById('savings-target-text');
        const savingsProgressPercentageEl = document.getElementById('savings-progress-percentage');
        const savingsProgressBarEl = document.getElementById('savings-progress-bar');

        if (totalSavingsAmountEl) totalSavingsAmountEl.textContent = window.formatCurrency(totalSavings);
        if (savingsTargetTextEl) savingsTargetTextEl.textContent = window.formatCurrency(savingsTarget);
        if (savingsProgressPercentageEl) savingsProgressPercentageEl.textContent = clampedProgress.toFixed(1) + '%';
        if (savingsProgressBarEl) savingsProgressBarEl.style.width = clampedProgress + '%';
    }

    // 最近の取引を更新
    function updateRecentTransactions(transactions) {
        const recentTransactionsList = document.getElementById('recent-transactions-list');
        if (!recentTransactionsList) return;

        recentTransactionsList.innerHTML = '';

        // 最新の5件のみ表示
        const recentTransactions = transactions.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        }).slice(0, 5);

        if (recentTransactions.length === 0) {
            recentTransactionsList.innerHTML = '<div class="no-transactions">取引データがありません</div>';
        } else {
            recentTransactions.forEach(transaction => {
                const transactionDate = new Date(transaction.date);
                const formattedDate = `${transactionDate.getFullYear()}/${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}/${transactionDate.getDate().toString().padStart(2, '0')}`;

                const transactionItem = document.createElement('div');
                transactionItem.className = 'transaction-item';

                const type = transaction.amount > 0 ? 'income' : 'expense';
                const icon = type === 'income' ? 'arrow-up' : 'arrow-down';

                transactionItem.innerHTML = `
                    <div class="transaction-icon ${type}">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-title">${transaction.category}</div>
                        <div class="transaction-date">${formattedDate}${transaction.memo ? ` - ${transaction.memo}` : ''}</div>
                    </div>
                    <div class="transaction-amount ${type}">
                        ${transaction.amount > 0 ? '+' : ''}${window.formatCurrency(transaction.amount)}
                    </div>
                `;

                recentTransactionsList.appendChild(transactionItem);
            });
        }
    }

    // チャートを更新
    function updateCharts(transactions, allTransactions) {
        // 残高推移チャート
        updateBalanceChart(transactions);

        // 支出カテゴリ円グラフ
        updateExpensePieChart(transactions);

        // 貯蓄推移チャート
        updateSavingsChart(allTransactions);
    }

    // 残高推移チャート
    function updateBalanceChart(transactions) {
        const chartEl = document.getElementById('balanceChart');
        if (!chartEl) return;

        // 日付ごとのデータを生成
        const daysInMonth = new Date(window.appState.currentYear, window.appState.currentMonth + 1, 0).getDate();
        const dailyData = [];
        let runningBalance = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(window.appState.currentYear, window.appState.currentMonth, day);
            const dayTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate.getDate() === day;
            });

            let dailyIncome = 0;
            let dailyExpense = 0;

            dayTransactions.forEach(transaction => {
                if (transaction.amount > 0) {
                    dailyIncome += transaction.amount;
                } else {
                    dailyExpense += Math.abs(transaction.amount);
                }
            });

            runningBalance += (dailyIncome - dailyExpense);

            dailyData.push({
                date: `${day}日`,
                income: dailyIncome,
                expense: dailyExpense,
                balance: runningBalance
            });
        }

        // グラフを描画
        const ctx = chartEl.getContext('2d');

        // 既存のチャートがあれば破棄
        if (window.balanceChart instanceof Chart) {
            window.balanceChart.destroy();
        }

        window.balanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyData.map(data => data.date),
                datasets: [{
                    label: '残高推移',
                    data: dailyData.map(data => data.balance),
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
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
                                return window.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // 支出カテゴリ円グラフ
    function updateExpensePieChart(transactions) {
        const chartEl = document.getElementById('expensePieChart');
        if (!chartEl) return;

        // 支出のみフィルタリング
        const expenseTransactions = transactions.filter(transaction => transaction.amount < 0);

        // カテゴリごとの支出を計算
        const categoryExpenses = {};

        expenseTransactions.forEach(transaction => {
            const category = transaction.category;
            const amount = Math.abs(transaction.amount);

            if (categoryExpenses[category]) {
                categoryExpenses[category] += amount;
            } else {
                categoryExpenses[category] = amount;
            }
        });

        // チャートデータを生成
        const categories = Object.keys(categoryExpenses);
        const amounts = Object.values(categoryExpenses);

        // カテゴリごとの色を生成
        const colors = window.generateColors ? window.generateColors(categories.length) : [];

        // グラフを描画
        const ctx = chartEl.getContext('2d');

        // 既存のチャートがあれば破棄
        if (window.expensePieChart instanceof Chart) {
            window.expensePieChart.destroy();
        }

        window.expensePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1
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
                                return `${context.label}: ${window.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 貯蓄推移チャート
    function updateSavingsChart(allTransactions) {
        const chartEl = document.getElementById('savingsGrowthChart');
        if (!chartEl) return;

        // 過去6ヶ月分の貯蓄推移データを生成
        const months = [];
        const savingsData = [];

        let runningTotal = 0;

        // ソートされたトランザクションの配列を作成
        const sortedTransactions = [...allTransactions].sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        // 月ごとのグループを作成
        const monthlyGroups = {};

        sortedTransactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()+1}`;

            if (!monthlyGroups[monthKey]) {
                monthlyGroups[monthKey] = 0;
            }

            monthlyGroups[monthKey] += transaction.amount;
        });

        // 月ごとのデータを配列に変換
        const monthlyData = Object.entries(monthlyGroups).map(([key, value]) => {
            const [year, month] = key.split('-').map(Number);
            return {
                date: new Date(year, month - 1, 1),
                amount: value
            };
        }).sort((a, b) => a.date - b.date);

        // 最新の6ヶ月分のみを使用
        const recentMonths = monthlyData.slice(-6);

        // 累積値を計算
        recentMonths.forEach(monthData => {
            runningTotal += monthData.amount;
            months.push(monthData.date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }));
            savingsData.push(runningTotal);
        });

        // もしデータがない場合は現在からの6ヶ月分のダミーデータを作成
        if (months.length === 0) {
            const currentDate = new Date();
            for (let i = 5; i >= 0; i--) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                months.push(date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }));
                savingsData.push(0);
            }
        }

        // グラフを描画
        const ctx = chartEl.getContext('2d');

        // 既存のチャートがあれば破棄
        if (window.savingsChart instanceof Chart) {
            window.savingsChart.destroy();
        }

        window.savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '総貯蓄額推移',
                    data: savingsData,
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
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
                                return window.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // 貯蓄目標編集モーダル関連
    const savingsTargetModal = document.getElementById('savings-target-modal');
    const editSavingsTargetBtn = document.getElementById('edit-savings-target');
    const closeModalBtn = document.querySelector('#savings-target-modal .close-modal');
    const savingsTargetForm = document.getElementById('savings-target-form');

    // 初期の貯蓄目標を設定（未設定の場合のみ）
    if (!localStorage.getItem('savingsTarget')) {
        localStorage.setItem('savingsTarget', '3000000'); // デフォルト: 300万円
    }

    if (editSavingsTargetBtn && savingsTargetModal) {
        editSavingsTargetBtn.addEventListener('click', function() {
            // 現在の目標値をフォームにセット
            const currentTarget = localStorage.getItem('savingsTarget') || '3000000';
            document.getElementById('savings-target-amount').value = currentTarget;

            // モーダルを表示
            savingsTargetModal.style.display = 'flex';
        });
    }

    if (closeModalBtn && savingsTargetModal) {
        closeModalBtn.addEventListener('click', function() {
            savingsTargetModal.style.display = 'none';
        });
    }

    // モーダル外をクリックしても閉じる
    if (savingsTargetModal) {
        window.addEventListener('click', function(event) {
            if (event.target === savingsTargetModal) {
                savingsTargetModal.style.display = 'none';
            }
        });
    }

    if (savingsTargetForm) {
        savingsTargetForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 入力値を取得
            const targetAmount = document.getElementById('savings-target-amount').value;

            // ローカルストレージに保存
            localStorage.setItem('savingsTarget', targetAmount);

            // モーダルを閉じる
            savingsTargetModal.style.display = 'none';

            // 表示を更新
            loadDashboardData();
        });
    }
});