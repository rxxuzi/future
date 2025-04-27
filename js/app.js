// app.js - 共通機能のみを含める
document.addEventListener('DOMContentLoaded', function() {
    // グローバル変数 - 他のスクリプトからアクセス可能にする
    window.appState = {
        currentDate: new Date(),
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth()
    };

    // 日付フィルターを更新
    updateDateRangeDisplay();

    // 日付ナビゲーションイベント
    const prevBtn = document.getElementById('date-prev');
    const nextBtn = document.getElementById('date-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (window.appState.currentMonth === 0) {
                window.appState.currentYear--;
                window.appState.currentMonth = 11;
            } else {
                window.appState.currentMonth--;
            }
            updateDateRangeDisplay();

            // イベントをディスパッチして他のスクリプトに通知
            document.dispatchEvent(new CustomEvent('dateChanged'));
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (window.appState.currentMonth === 11) {
                window.appState.currentYear++;
                window.appState.currentMonth = 0;
            } else {
                window.appState.currentMonth++;
            }
            updateDateRangeDisplay();

            // イベントをディスパッチして他のスクリプトに通知
            document.dispatchEvent(new CustomEvent('dateChanged'));
        });
    }

    // 日付範囲表示を更新
    function updateDateRangeDisplay() {
        const dateRangeEl = document.getElementById('current-date-range');
        if (dateRangeEl) {
            const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            dateRangeEl.textContent = `${window.appState.currentYear}年${months[window.appState.currentMonth]}`;
        }
    }

    // 新規取引モーダル関連
    const transactionModal = document.getElementById('transaction-modal');
    const showModalBtn = document.getElementById('show-transaction-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const transactionForm = document.getElementById('transaction-form');

    // デフォルトで現在の日付をセット
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // モーダルを表示
    if (showModalBtn && transactionModal) {
        showModalBtn.addEventListener('click', function() {
            transactionModal.style.display = 'flex';
        });
    }

    // モーダルを閉じる
    if (closeModalBtn && transactionModal) {
        closeModalBtn.addEventListener('click', function() {
            transactionModal.style.display = 'none';
        });
    }

    // モーダル外をクリックしても閉じる
    if (transactionModal) {
        window.addEventListener('click', function(event) {
            if (event.target === transactionModal) {
                transactionModal.style.display = 'none';
            }
        });
    }

    // 取引タイプボタンの切り替え
    const transactionTypeButtons = document.querySelectorAll('.transaction-type-btn');

    transactionTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // アクティブクラスを切り替え
            const parent = this.closest('.modal-content');
            if (parent) {
                const buttons = parent.querySelectorAll('.transaction-type-btn');
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                // 取引タイプに応じてカテゴリを切り替え
                const type = this.dataset.type;
                const prefix = this.closest('#edit-transaction-modal') ? 'edit-' : '';
                const incomeCategories = document.getElementById(`${prefix}income-categories`);
                const expenseCategories = document.getElementById(`${prefix}expense-categories`);

                if (incomeCategories && expenseCategories) {
                    if (type === 'income') {
                        incomeCategories.style.display = 'block';
                        expenseCategories.style.display = 'none';
                        const option = document.querySelector(`#${prefix}income-categories option`);
                        if (option) option.selected = true;
                    } else {
                        incomeCategories.style.display = 'none';
                        expenseCategories.style.display = 'block';
                        const option = document.querySelector(`#${prefix}expense-categories option`);
                        if (option) option.selected = true;
                    }
                }
            }
        });
    });

    // 取引フォームの送信
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // フォームデータ取得
            const activeTypeBtn = document.querySelector('.transaction-type-btn.active');
            if (!activeTypeBtn) {
                console.error('No active transaction type button found!');
                return;
            }

            const activeType = activeTypeBtn.dataset.type;
            const amountEl = document.getElementById('amount');
            const categoryEl = document.getElementById('category');
            const dateEl = document.getElementById('date');
            const memoEl = document.getElementById('memo');

            if (!amountEl || !categoryEl || !dateEl || !memoEl) {
                console.error('Required form elements not found!');
                return;
            }

            const amount = parseFloat(amountEl.value);
            const category = categoryEl.value;
            const date = dateEl.value;
            const memo = memoEl.value;

            // エラーチェック
            if (isNaN(amount) || amount <= 0) {
                alert('有効な金額を入力してください');
                return;
            }

            if (!category) {
                alert('カテゴリを選択してください');
                return;
            }

            if (!date) {
                alert('日付を選択してください');
                return;
            }

            console.log('Saving transaction:', {
                type: activeType,
                amount: activeType === 'income' ? amount : -amount,
                category: category,
                date: date,
                memo: memo
            });

            // ローカルストレージに保存
            const transaction = {
                id: Date.now(), // 一意のID
                type: activeType,
                amount: activeType === 'income' ? amount : -amount,
                category: category,
                date: date,
                memo: memo,
                timestamp: new Date().toISOString()
            };

            // 既存のトランザクションを取得
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            transactions.push(transaction);

            // 保存してからコンソールに出力して確認
            localStorage.setItem('transactions', JSON.stringify(transactions));
            console.log('Saved transactions:', JSON.parse(localStorage.getItem('transactions')));

            // モーダルを閉じる
            if (transactionModal) transactionModal.style.display = 'none';

            // フォームをリセット
            transactionForm.reset();
            if (dateInput) dateInput.valueAsDate = new Date();

            // 最初のタイプボタンをアクティブにする
            const firstButton = document.querySelector('.transaction-type-btn');
            if (firstButton) firstButton.click();

            // データ変更イベントをディスパッチ
            console.log('Dispatching transactionsChanged event');
            document.dispatchEvent(new CustomEvent('transactionsChanged'));
        });
    }

    // 取引データを保存 - 共通関数
    window.saveTransaction = function(transaction) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    // 金額のフォーマット - 共通関数
    window.formatCurrency = function(amount) {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // カラフルな色を生成 - 共通関数
    window.generateColors = function(count) {
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
    };

    // 現在の月のトランザクションをフィルタリングする共通関数
    window.getFilteredTransactions = function() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const startDate = new Date(window.appState.currentYear, window.appState.currentMonth, 1);
        const endDate = new Date(window.appState.currentYear, window.appState.currentMonth + 1, 0);

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    };
});