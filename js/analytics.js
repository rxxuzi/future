// analytics.js 分析ページ用js

document.addEventListener('DOMContentLoaded', function() {
    // 日付設定
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    let currentQuarter = Math.floor(currentMonth / 3);
    
    // 選択された日付範囲
    let dateRange = 'month';
    
    // 日付範囲選択の変更イベント
    document.getElementById('date-range').addEventListener('change', function() {
        dateRange = this.value;
        updateDateRangeDisplay();
        loadData();
    });
    
    // 日付ナビゲーションイベント
    document.getElementById('date-prev').addEventListener('click', function() {
        switch (dateRange) {
            case 'month':
                if (currentMonth === 0) {
                    currentYear--;
                    currentMonth = 11;
                } else {
                    currentMonth--;
                }
                break;
            case 'quarter':
                if (currentQuarter === 0) {
                    currentYear--;
                    currentQuarter = 3;
                } else {
                    currentQuarter--;
                }
                currentMonth = currentQuarter * 3;
                break;
            case 'year':
                currentYear--;
                break;
        }
        updateDateRangeDisplay();
        loadData();
    });
    
    document.getElementById('date-next').addEventListener('click', function() {
        switch (dateRange) {
            case 'month':
                if (currentMonth === 11) {
                    currentYear++;
                    currentMonth = 0;
                } else {
                    currentMonth++;
                }
                break;
            case 'quarter':
                if (currentQuarter === 3) {
                    currentYear++;
                    currentQuarter = 0;
                } else {
                    currentQuarter++;
                }
                currentMonth = currentQuarter * 3;
                break;
            case 'year':
                currentYear++;
                break;
        }
        updateDateRangeDisplay();
        loadData();
    });
    
    // 日付範囲表示を更新
    function updateDateRangeDisplay() {
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        const quarters = ['第1四半期', '第2四半期', '第3四半期', '第4四半期'];
        
        let displayText = '';
        
        switch (dateRange) {
            case 'month':
                displayText = `${currentYear}年${months[currentMonth]}`;
                break;
            case 'quarter':
                displayText = `${currentYear}年 ${quarters[currentQuarter]}`;
                break;
            case 'year':
                displayText = `${currentYear}年`;
                break;
            case 'custom':
                // カスタム日付範囲の実装（必要に応じて）
                displayText = `カスタム範囲`;
                break;
        }
        
        document.getElementById('current-date-range').textContent = displayText;
    }
    
    // 予算設定モーダル
    const budgetModal = document.getElementById('budget-modal');
    const setBudgetBtn = document.getElementById('set-budget');
    const closeBudgetModalBtn = budgetModal.querySelector('.close-modal');
    const budgetForm = document.getElementById('budget-form');
    
    // 予算設定モーダルを開く
    setBudgetBtn.addEventListener('click', function() {
        openBudgetModal();
    });
    
    // モーダルを閉じる
    closeBudgetModalBtn.addEventListener('click', function() {
        budgetModal.style.display = 'none';
    });
    
    // モーダル外をクリックしても閉じる
    window.addEventListener('click', function(event) {
        if (event.target === budgetModal) {
            budgetModal.style.display = 'none';
        }
    });
    
    // 予算設定モーダルを開く
    function openBudgetModal() {
        const budgetCategories = document.querySelector('.budget-categories');
        budgetCategories.innerHTML = '';
        
        // カテゴリ一覧
        const categories = [
            '食費', '住居費', '光熱費', '通信費', '交通費',
            '娯楽費', '医療費', '教育費', '貯蓄', '投資', 'その他支出'
        ];
        
        // 現在の予算設定を取得
        const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
        
        // 各カテゴリの予算入力欄を生成
        categories.forEach(category => {
            const budgetValue = budgets[category] || 0;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'form-group';
            categoryDiv.innerHTML = `
                <label for="budget-${category}">${category}</label>
                <input type="number" id="budget-${category}" name="${category}" value="${budgetValue}" min="0" step="1000">
            `;
            
            budgetCategories.appendChild(categoryDiv);
        });
        
        // モーダルを表示
        budgetModal.style.display = 'flex';
    }
    
    // 予算設定の保存
    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const budgets = {};
        
        for (let [category, value] of formData.entries()) {
            budgets[category] = parseInt(value) || 0;
        }
        
        // ローカルストレージに保存
        localStorage.setItem('budgets', JSON.stringify(budgets));
        
        // モーダルを閉じる
        budgetModal.style.display = 'none';
        
        // データを再読み込み
        loadData();
    });
    
    // データ読み込み
    function loadData() {
        // 日付範囲に基づいてデータをフィルタリング
        const transactions = filterTransactionsByDateRange();
        
        // 収支サマリーを更新
        updateSummary(transactions);
        
        // チャートを更新
        updateCategoryExpenseChart(transactions);
        updateTrendChart();
        updateWeeklyExpenseChart(transactions);
        updateSavingsTrendChart();
        
        // 予算と実績を更新
        updateBudgetPerformance(transactions);
        
        // 主要支出を更新
        updateTopExpenses(transactions);
    }
    
    // 日付範囲でトランザクションをフィルタリング
    function filterTransactionsByDateRange() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        let startDate, endDate;
        
        switch (dateRange) {
            case 'month':
                startDate = new Date(currentYear, currentMonth, 1);
                endDate = new Date(currentYear, currentMonth + 1, 0);
                break;
            case 'quarter':
                startDate = new Date(currentYear, currentQuarter * 3, 1);
                endDate = new Date(currentYear, (currentQuarter + 1) * 3, 0);
                break;
            case 'year':
                startDate = new Date(currentYear, 0, 1);
                endDate = new Date(currentYear, 12, 0);
                break;
            case 'custom':
                // カスタム日付範囲の実装（必要に応じて）
                startDate = new Date(currentYear, currentMonth, 1);
                endDate = new Date(currentYear, currentMonth + 1, 0);
                break;
        }
        
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }
    
    // 収支サマリーを更新
    function updateSummary(transactions) {
        let totalIncome = 0;
        let totalExpense = 0;
        
        transactions.forEach(transaction => {
            if (transaction.amount > 0) {
                totalIncome += transaction.amount;
            } else {
                totalExpense += Math.abs(transaction.amount);
            }
        });
        
        const totalSavings = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
        
        document.getElementById('total-income').textContent = formatCurrency(totalIncome);
        document.getElementById('total-expense').textContent = formatCurrency(totalExpense);
        document.getElementById('total-savings').textContent = formatCurrency(totalSavings);
        document.getElementById('savings-rate').textContent = savingsRate.toFixed(1) + '%';
    }
    
    // カテゴリ別支出チャートを更新
    function updateCategoryExpenseChart(transactions) {
        // カテゴリごとの支出を計算
        const categoryExpenses = {};
        
        transactions.forEach(transaction => {
            if (transaction.amount < 0) {
                const category = transaction.category;
                const amount = Math.abs(transaction.amount);
                
                if (categoryExpenses[category]) {
                    categoryExpenses[category] += amount;
                } else {
                    categoryExpenses[category] = amount;
                }
            }
        });
        
        // チャートデータの生成
        const categories = Object.keys(categoryExpenses);
        const amounts = Object.values(categoryExpenses);
        
        // カテゴリごとの色を生成
        const colors = generateColors(categories.length);
        
        // グラフを描画
        const ctx = document.getElementById('categoryExpenseChart').getContext('2d');
        
        // 既存のチャートがあれば破棄
        if (window.categoryExpenseChart instanceof Chart) {
            window.categoryExpenseChart.destroy();
        }
        
        window.categoryExpenseChart = new Chart(ctx, {
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
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // 月次推移チャートを更新
    function updateTrendChart() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        let months = [];
        let incomeData = [];
        let expenseData = [];
        let netData = [];
        
        // 年間のデータを準備
        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(currentYear, i, 1);
            const monthName = monthDate.toLocaleDateString('ja-JP', { month: 'short' });
            months.push(monthName);
            
            // 月ごとのデータをフィルタリング
            const monthlyTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate.getFullYear() === currentYear && transactionDate.getMonth() === i;
            });
            
            // 月ごとの収支を計算
            let monthlyIncome = 0;
            let monthlyExpense = 0;
            
            monthlyTransactions.forEach(transaction => {
                if (transaction.amount > 0) {
                    monthlyIncome += transaction.amount;
                } else {
                    monthlyExpense += Math.abs(transaction.amount);
                }
            });
            
            incomeData.push(monthlyIncome);
            expenseData.push(monthlyExpense);
            netData.push(monthlyIncome - monthlyExpense);
        }
        
        // グラフを描画
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        // 既存のチャートがあれば破棄
        if (window.trendChart instanceof Chart) {
            window.trendChart.destroy();
        }
        
        window.trendChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: '収入',
                        data: incomeData,
                        backgroundColor: 'rgba(56, 176, 0, 0.7)',
                        borderColor: 'rgba(56, 176, 0, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '支出',
                        data: expenseData,
                        backgroundColor: 'rgba(230, 57, 70, 0.7)',
                        borderColor: 'rgba(230, 57, 70, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '収支',
                        data: netData,
                        type: 'line',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
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
                        }
                    }
                }
            }
        });
    }
    
    // 貯蓄推移チャートを更新
    function updateSavingsTrendChart() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
        // 全期間のデータを取得（開始日から現在まで）
        // 開始日は最初のトランザクションの日付、または現在の年の1月1日
        let startDate;
        if (transactions.length > 0) {
            // 日付でソート
            const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
            startDate = new Date(sortedTransactions[0].date);
        } else {
            startDate = new Date(currentYear, 0, 1);
        }
        
        const endDate = new Date();
        const labels = [];
        const cumulativeSavings = [];
        let runningTotal = 0;
        
        // 月ごとのデータを準備
        let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        
        while (currentMonth <= endDate) {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            
            // 月ごとのデータをフィルタリング
            const monthlyTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
            });
            
            // 月ごとの収支を計算
            let monthlyIncome = 0;
            let monthlyExpense = 0;
            
            monthlyTransactions.forEach(transaction => {
                if (transaction.amount > 0) {
                    monthlyIncome += transaction.amount;
                } else {
                    monthlyExpense += Math.abs(transaction.amount);
                }
            });
            
            // 貯蓄額を累積
            runningTotal += (monthlyIncome - monthlyExpense);
            
            // ラベルと貯蓄データを追加
            const monthName = currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' });
            labels.push(monthName);
            cumulativeSavings.push(runningTotal);
            
            // 次の月へ
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        
        // グラフを描画
        const ctx = document.getElementById('savingsTrendChart').getContext('2d');
        
        // 既存のチャートがあれば破棄
        if (window.savingsTrendChart instanceof Chart) {
            window.savingsTrendChart.destroy();
        }
        
        window.savingsTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '累積貯蓄額',
                    data: cumulativeSavings,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
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
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                            maxRotation: 45,
                            minRotation: 45
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
                        }
                    }
                }
            }
        });
    }
    
    // 週別支出チャートを更新
    function updateWeeklyExpenseChart(transactions) {
        // 選択された月の週ごとの支出を計算
        const weeklyExpenses = [0, 0, 0, 0, 0]; // 5週間分のデータ
        
        transactions.forEach(transaction => {
            if (transaction.amount < 0) {
                const date = new Date(transaction.date);
                const day = date.getDate();
                // 簡易的な週計算（1-7日: 第1週, 8-14日: 第2週, ...）
                const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
                weeklyExpenses[weekIndex] += Math.abs(transaction.amount);
            }
        });
        
        // グラフを描画
        const ctx = document.getElementById('weeklyExpenseChart').getContext('2d');
        
        // 既存のチャートがあれば破棄
        if (window.weeklyExpenseChart instanceof Chart) {
            window.weeklyExpenseChart.destroy();
        }
        
        window.weeklyExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['第1週', '第2週', '第3週', '第4週', '第5週'],
                datasets: [{
                    label: '週別支出',
                    data: weeklyExpenses,
                    backgroundColor: 'rgba(230, 57, 70, 0.7)',
                    borderColor: 'rgba(230, 57, 70, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatCurrency(context.raw);
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
                        }
                    }
                }
            }
        });
    }
    
    // 予算と実績を更新
    function updateBudgetPerformance(transactions) {
        // 予算データを取得
        const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
        
        // カテゴリごとの支出を計算
        const categoryExpenses = {};
        
        transactions.forEach(transaction => {
            if (transaction.amount < 0) {
                const category = transaction.category;
                const amount = Math.abs(transaction.amount);
                
                if (categoryExpenses[category]) {
                    categoryExpenses[category] += amount;
                } else {
                    categoryExpenses[category] = amount;
                }
            }
        });
        
        // 予算と実績のリストを更新
        const budgetPerformanceList = document.getElementById('budget-performance-list');
        budgetPerformanceList.innerHTML = '';
        
        // 予算が設定されているカテゴリのみ表示
        const categories = Object.keys(budgets).filter(category => budgets[category] > 0);
        
        if (categories.length === 0) {
            budgetPerformanceList.innerHTML = '<div class="no-data">予算が設定されていません</div>';
            return;
        }
        
        categories.forEach(category => {
            const budget = budgets[category] || 0;
            const expense = categoryExpenses[category] || 0;
            const percentage = budget > 0 ? (expense / budget) * 100 : 0;
            
            const performanceItem = document.createElement('div');
            performanceItem.className = 'budget-performance-item';
            
            let statusClass = '';
            if (percentage >= 100) {
                statusClass = 'over-budget';
            } else if (percentage >= 80) {
                statusClass = 'near-budget';
            }
            
            performanceItem.innerHTML = `
                <div class="budget-category">${category}</div>
                <div class="budget-amounts">
                    <span class="actual">${formatCurrency(expense)}</span>
                    <span class="budget">/ ${formatCurrency(budget)}</span>
                </div>
                <div class="budget-progress">
                    <div class="progress-bar ${statusClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <div class="budget-percentage ${statusClass}">${percentage.toFixed(1)}%</div>
            `;
            
            budgetPerformanceList.appendChild(performanceItem);
        });
    }
    
    // 主要支出を更新
    function updateTopExpenses(transactions) {
        // 支出のみをフィルタリング
        const expenses = transactions.filter(transaction => transaction.amount < 0);
        
        // 金額の絶対値で並べ替え
        expenses.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        
        // 上位5件を表示
        const topExpensesList = document.getElementById('top-expenses-list');
        topExpensesList.innerHTML = '';
        
        if (expenses.length === 0) {
            topExpensesList.innerHTML = '<div class="no-data">支出データがありません</div>';
            return;
        }
        
        const topExpenses = expenses.slice(0, 5);
        
        topExpenses.forEach(expense => {
            const date = new Date(expense.date);
            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            
            const expenseItem = document.createElement('div');
            expenseItem.className = 'top-expense-item';
            
            expenseItem.innerHTML = `
                <div class="expense-info">
                    <div class="expense-category">${expense.category}</div>
                    <div class="expense-date">${formattedDate}</div>
                    <div class="expense-memo">${expense.memo || '-'}</div>
                </div>
                <div class="expense-amount">${formatCurrency(Math.abs(expense.amount))}</div>
            `;
            
            topExpensesList.appendChild(expenseItem);
        });
    }
    
    // カラフルな色を生成
    function generateColors(count) {
        const colors = [
            '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0',
            '#4895ef', '#560bad', '#f3722c', '#f8961e', '#f9c74f',
            '#90be6d', '#43aa8b', '#577590', '#277da1'
        ];
        
        if (count <= colors.length) {
            return colors.slice(0, count);
        }
        
        // 色が足りない場合はランダムに生成
        const result = [...colors];
        for (let i = colors.length; i < count; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            result.push(`rgb(${r}, ${g}, ${b})`);
        }
        
        return result;
    }
    
    // 金額のフォーマット
    function formatCurrency(amount) {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    // 初期表示
    updateDateRangeDisplay();
    loadData();
});