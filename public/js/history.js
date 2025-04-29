// history.js 履歴機能用js
document.addEventListener('DOMContentLoaded', function() {
    // 現在の表示月
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    let filters = {
        type: 'all',
        category: 'all',
        sort: 'date-desc',
        search: '',
        page: 1,
        perPage: 10
    };

    // 日付フィルターを更新
    updateDateRangeDisplay();

    // 日付ナビゲーションイベント
    document.getElementById('date-prev').addEventListener('click', function() {
        if (currentMonth === 0) {
            currentYear--;
            currentMonth = 11;
        } else {
            currentMonth--;
        }
        updateDateRangeDisplay();
        loadTransactions();
    });

    document.getElementById('date-next').addEventListener('click', function() {
        if (currentMonth === 11) {
            currentYear++;
            currentMonth = 0;
        } else {
            currentMonth++;
        }
        updateDateRangeDisplay();
        loadTransactions();
    });

    // 日付範囲表示を更新
    function updateDateRangeDisplay() {
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        document.getElementById('current-date-range').textContent = `${currentYear}年${months[currentMonth]}`;
    }

    // フィルター変更イベント
    document.getElementById('type-filter').addEventListener('change', function() {
        filters.type = this.value;
        filters.page = 1;
        loadTransactions();
    });

    document.getElementById('category-filter').addEventListener('change', function() {
        filters.category = this.value;
        filters.page = 1;
        loadTransactions();
    });

    document.getElementById('sort-filter').addEventListener('change', function() {
        filters.sort = this.value;
        filters.page = 1;
        loadTransactions();
    });

    document.getElementById('search-btn').addEventListener('click', function() {
        filters.search = document.getElementById('search-filter').value.trim();
        filters.page = 1;
        loadTransactions();
    });

    document.getElementById('search-filter').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filters.search = this.value.trim();
            filters.page = 1;
            loadTransactions();
        }
    });

    // CSVエクスポート
    document.getElementById('export-csv').addEventListener('click', function() {
        exportToCSV();
    });

    // 取引データの読み込み
    async function loadTransactions() {
        try {
            // APIからデータを取得
            const response = await window.api.transactions.getMonthlyTransactions(currentYear, currentMonth + 1);
            let transactions = response.transactions || [];

            // 表示前にフィルタリングと並べ替え
            processAndDisplayTransactions(transactions);
        } catch (error) {
            console.error('Failed to load transactions:', error);
            // エラー時はローカルストレージからフォールバック
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            // 現在の月のデータをフィルタリング
            const startDate = new Date(currentYear, currentMonth, 1);
            const endDate = new Date(currentYear, currentMonth + 1, 0);

            let filteredTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });

            processAndDisplayTransactions(filteredTransactions);
        }
    }

    // トランザクションのフィルタリング・ソート・表示
    function processAndDisplayTransactions(transactions) {
        // タイプでフィルタリング
        if (filters.type !== 'all') {
            transactions = transactions.filter(transaction => {
                return (filters.type === 'income' && transaction.amount > 0) ||
                    (filters.type === 'expense' && transaction.amount < 0);
            });
        }

        // カテゴリでフィルタリング
        if (filters.category !== 'all') {
            transactions = transactions.filter(transaction => {
                return transaction.category === filters.category;
            });
        }

        // メモで検索
        if (filters.search !== '') {
            const searchLower = filters.search.toLowerCase();
            transactions = transactions.filter(transaction => {
                return transaction.memo && transaction.memo.toLowerCase().includes(searchLower);
            });
        }

        // 並び替え
        transactions.sort((a, b) => {
            switch (filters.sort) {
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'amount-asc':
                    return a.amount - b.amount;
                case 'amount-desc':
                    return b.amount - a.amount;
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        // ページネーション
        const totalItems = transactions.length;
        const totalPages = Math.ceil(totalItems / filters.perPage);
        const startIndex = (filters.page - 1) * filters.perPage;
        const endIndex = Math.min(startIndex + filters.perPage, totalItems);
        const paginatedTransactions = transactions.slice(startIndex, endIndex);

        // 取引リストを更新
        renderTransactionTable(paginatedTransactions);

        // ページネーションを更新
        renderPagination(totalPages);
    }

    // 取引テーブルの描画
    function renderTransactionTable(transactions) {
        const tableBody = document.getElementById('transactions-table-body');
        tableBody.innerHTML = '';

        if (transactions.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="5" class="no-data">データがありません</td>`;
            tableBody.appendChild(noDataRow);
            return;
        }

        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const formattedDate = `${transactionDate.getFullYear()}/${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}/${transactionDate.getDate().toString().padStart(2, '0')}`;

            const row = document.createElement('tr');
            const type = transaction.amount > 0 ? 'income' : 'expense';

            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.category}</td>
                <td>${transaction.memo || '-'}</td>
                <td class="amount ${type}">
                    ${transaction.amount > 0 ? '+' : ''}${formatCurrency(transaction.amount)}
                </td>
                <td>
                    <button class="btn btn-icon edit-transaction" data-id="${transaction.id || ''}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // 編集ボタンのイベントハンドラを設定
        setupEditButtons();
    }

    // 編集ボタンのイベントハンドラを設定
    function setupEditButtons() {
        const editButtons = document.querySelectorAll('.edit-transaction');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const transactionId = this.dataset.id;
                openEditModal(transactionId);
            });
        });
    }

    // ページネーションの描画
    function renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // 前へボタン
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn' + (filters.page === 1 ? ' disabled' : '');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.disabled = filters.page === 1;
        prevButton.addEventListener('click', function() {
            if (filters.page > 1) {
                filters.page--;
                loadTransactions();
            }
        });
        pagination.appendChild(prevButton);

        // ページ番号ボタン
        const maxVisiblePages = 5;
        const startPage = Math.max(1, filters.page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-btn' + (i === filters.page ? ' active' : '');
            pageButton.textContent = i;
            pageButton.addEventListener('click', function() {
                filters.page = i;
                loadTransactions();
            });
            pagination.appendChild(pageButton);
        }

        // 次へボタン
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn' + (filters.page === totalPages ? ' disabled' : '');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.disabled = filters.page === totalPages;
        nextButton.addEventListener('click', function() {
            if (filters.page < totalPages) {
                filters.page++;
                loadTransactions();
            }
        });
        pagination.appendChild(nextButton);
    }

    // 編集モーダルを開く
    async function openEditModal(transactionId) {
        try {
            // APIから取得を試みる
            const transactions = await window.api.transactions.getAllTransactions();
            const transaction = transactions.transactions.find(t => t.id === transactionId) || {};

            // フォームに値をセット
            document.getElementById('edit-id').value = transaction.id || '';
            document.getElementById('edit-amount').value = Math.abs(transaction.amount || 0);
            document.getElementById('edit-category').value = transaction.category || '';
            document.getElementById('edit-date').value = transaction.date || '';
            document.getElementById('edit-memo').value = transaction.memo || '';

            // 取引タイプボタンをセット
            const typeButtons = document.querySelectorAll('#edit-transaction-modal .transaction-type-btn');
            typeButtons.forEach(button => {
                button.classList.remove('active');
                if ((button.dataset.type === 'income' && transaction.amount > 0) ||
                    (button.dataset.type === 'expense' && transaction.amount < 0)) {
                    button.classList.add('active');
                }
            });

            // モーダルを表示
            document.getElementById('edit-transaction-modal').style.display = 'flex';
        } catch (error) {
            console.error('Failed to get transaction for editing:', error);
            // エラー時はローカルストレージからフォールバック
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const transaction = transactions.find(t => t.id === transactionId) || {};

            // フォームに値をセット
            document.getElementById('edit-id').value = transaction.id || '';
            document.getElementById('edit-amount').value = Math.abs(transaction.amount || 0);
            document.getElementById('edit-category').value = transaction.category || '';
            document.getElementById('edit-date').value = transaction.date || '';
            document.getElementById('edit-memo').value = transaction.memo || '';

            // 取引タイプボタンをセット
            const typeButtons = document.querySelectorAll('#edit-transaction-modal .transaction-type-btn');
            typeButtons.forEach(button => {
                button.classList.remove('active');
                if ((button.dataset.type === 'income' && transaction.amount > 0) ||
                    (button.dataset.type === 'expense' && transaction.amount < 0)) {
                    button.classList.add('active');
                }
            });

            // モーダルを表示
            document.getElementById('edit-transaction-modal').style.display = 'flex';
        }
    }

    // 編集モーダル関連
    const editModal = document.getElementById('edit-transaction-modal');
    const closeEditModalBtn = editModal.querySelector('.close-modal');
    const editForm = document.getElementById('edit-transaction-form');
    const typeButtons = editModal.querySelectorAll('.transaction-type-btn');
    const deleteBtn = document.getElementById('delete-transaction');

    // 取引タイプボタンの切り替え
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // カテゴリ表示を切り替え
            const type = this.dataset.type;
            const incomeCategories = document.getElementById('edit-income-categories');
            const expenseCategories = document.getElementById('edit-expense-categories');

            if (type === 'income') {
                incomeCategories.style.display = 'block';
                expenseCategories.style.display = 'none';
                document.querySelector('#edit-income-categories option').selected = true;
            } else {
                incomeCategories.style.display = 'none';
                expenseCategories.style.display = 'block';
                document.querySelector('#edit-expense-categories option').selected = true;
            }
        });
    });

    // モーダルを閉じる
    closeEditModalBtn.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // モーダル外をクリックしても閉じる
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // 取引の更新
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const id = document.getElementById('edit-id').value;
        const activeType = editModal.querySelector('.transaction-type-btn.active').dataset.type;
        const amount = parseFloat(document.getElementById('edit-amount').value);
        const category = document.getElementById('edit-category').value;
        const date = document.getElementById('edit-date').value;
        const memo = document.getElementById('edit-memo').value;

        // トランザクションデータの作成
        const transaction = {
            id: id,
            amount: activeType === 'income' ? amount : -amount,
            category: category,
            date: date,
            memo: memo
        };

        try {
            // APIを使用して更新
            await window.api.transactions.updateTransaction(transaction);

            // モーダルを閉じる
            editModal.style.display = 'none';

            // データを再読み込み
            loadTransactions();
        } catch (error) {
            console.error('Failed to update transaction:', error);
            alert('取引の更新に失敗しました。もう一度お試しください。');
        }
    });

    // 取引の削除
    deleteBtn.addEventListener('click', async function() {
        const id = document.getElementById('edit-id').value;

        if (confirm('この取引を削除してもよろしいですか？')) {
            try {
                // APIを使用して削除
                await window.api.transactions.deleteTransaction(id);

                // モーダルを閉じる
                editModal.style.display = 'none';

                // データを再読み込み
                loadTransactions();
            } catch (error) {
                console.error('Failed to delete transaction:', error);
                alert('取引の削除に失敗しました。もう一度お試しください。');
            }
        }
    });

    // CSVエクスポート
    async function exportToCSV() {
        try {
            // APIからデータを取得
            const response = await window.api.transactions.getMonthlyTransactions(currentYear, currentMonth + 1);
            const transactions = response.transactions || [];

            if (transactions.length === 0) {
                alert('エクスポートするデータがありません');
                return;
            }

            // CSVヘッダー
            let csv = '日付,カテゴリ,メモ,金額,タイプ\n';

            // データ行の追加
            transactions.forEach(transaction => {
                const type = transaction.amount > 0 ? '収入' : '支出';
                const amount = Math.abs(transaction.amount);
                const memo = transaction.memo ? `"${transaction.memo.replace(/"/g, '""')}"` : '';

                csv += `${transaction.date},${transaction.category},${memo},${amount},${type}\n`;
            });

            // CSVファイルのダウンロード
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const filename = `budget_${currentYear}${(currentMonth + 1).toString().padStart(2, '0')}.csv`;

            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Failed to export transactions:', error);
            alert('データのエクスポートに失敗しました。もう一度お試しください。');

            // エラー時はローカルストレージからフォールバック
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const filteredTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate.getFullYear() === currentYear &&
                    transactionDate.getMonth() === currentMonth;
            });

            if (filteredTransactions.length === 0) {
                alert('エクスポートするデータがありません');
                return;
            }

            // CSVヘッダー
            let csv = '日付,カテゴリ,メモ,金額,タイプ\n';

            // データ行の追加
            filteredTransactions.forEach(transaction => {
                const type = transaction.amount > 0 ? '収入' : '支出';
                const amount = Math.abs(transaction.amount);
                const memo = transaction.memo ? `"${transaction.memo.replace(/"/g, '""')}"` : '';

                csv += `${transaction.date},${transaction.category},${memo},${amount},${type}\n`;
            });

            // CSVファイルのダウンロード
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const filename = `budget_${currentYear}${(currentMonth + 1).toString().padStart(2, '0')}.csv`;

            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
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

    // 初期データのロード
    loadTransactions();

    // ローカルデータの同期を試みる
    tryToSyncLocalData();

    // ローカルデータを同期する関数
    async function tryToSyncLocalData() {
        const localTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        if (localTransactions.length > 0) {
            try {
                const result = await window.api.transactions.syncLocalData();
                if (result) {
                    console.log('ローカルデータをサーバーと同期しました');
                }
            } catch (error) {
                console.error('Failed to sync local data:', error);
            }
        }
    }
});