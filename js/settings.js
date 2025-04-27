document.addEventListener('DOMContentLoaded', function() {
    // 初期データのロード
    loadCategories();
    loadAppSettings();
    
    // タブ切り替え
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // アクティブクラスを切り替え
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // タブコンテンツを切り替え
            const type = this.dataset.type;
            tabPanes.forEach(pane => pane.classList.remove('active'));
            if (type === 'income') {
                document.getElementById('income-categories-pane').classList.add('active');
            } else {
                document.getElementById('expense-categories-pane').classList.add('active');
            }
        });
    });
    
    // アカウント設定フォーム
    const accountForm = document.getElementById('account-form');
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // 入力チェック
        if (!currentPassword) {
            alert('現在のパスワードを入力してください');
            return;
        }
        
        if (!newPassword) {
            alert('新しいパスワードを入力してください');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('新しいパスワードと確認用パスワードが一致しません');
            return;
        }
        
        // パスワード変更（実際の実装ではAjaxでサーバーに送信）
        alert('パスワードが変更されました（デモ用のメッセージです）');
        accountForm.reset();
    });
    
    // 収入カテゴリ追加フォーム
    const addIncomeCategoryForm = document.getElementById('add-income-category-form');
    addIncomeCategoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const categoryName = document.getElementById('new-income-category').value.trim();
        if (!categoryName) return;
        
        // カテゴリの追加
        addCategory('income', categoryName);
        
        // フォームをリセット
        this.reset();
    });
    
    // 支出カテゴリ追加フォーム
    const addExpenseCategoryForm = document.getElementById('add-expense-category-form');
    addExpenseCategoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const categoryName = document.getElementById('new-expense-category').value.trim();
        if (!categoryName) return;
        
        // カテゴリの追加
        addCategory('expense', categoryName);
        
        // フォームをリセット
        this.reset();
    });
    
    // アプリ設定フォーム
    const appSettingsForm = document.getElementById('app-settings-form');
    appSettingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータの取得
        const settings = {
            currency: document.getElementById('currency').value,
            dateFormat: document.getElementById('date-format').value,
            language: document.getElementById('language').value,
            darkMode: document.getElementById('dark-mode').checked
        };
        
        // 設定の保存
        saveAppSettings(settings);
        
        alert('設定が保存されました');
    });
    
    // データエクスポート
    document.getElementById('export-data').addEventListener('click', function() {
        exportData();
    });
    
    // データインポートのファイル選択
    document.getElementById('import-file').addEventListener('change', function(e) {
        if (this.files.length > 0) {
            const file = this.files[0];
            
            // CSVファイルのみ受け付ける
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                alert('CSVファイルを選択してください');
                this.value = '';
                return;
            }
            
            // ファイルの読み込み
            const reader = new FileReader();
            reader.onload = function(event) {
                const csv = event.target.result;
                previewImport(csv);
            };
            reader.readAsText(file);
        }
    });
    
    // サンプルデータ追加
    document.getElementById('add-sample-data').addEventListener('click', function() {
        if (confirm('サンプルデータを追加してもよろしいですか？')) {
            addSampleData();
        }
    });
    
    // データリセット
    document.getElementById('reset-data').addEventListener('click', function() {
        if (confirm('すべてのデータを削除してもよろしいですか？この操作は元に戻せません。')) {
            resetData();
        }
    });
    
    // インポートモーダル関連
    const importModal = document.getElementById('import-modal');
    const closeImportModalBtn = importModal.querySelector('.close-modal');
    const confirmImportBtn = document.getElementById('confirm-import');
    
    // モーダルを閉じる
    closeImportModalBtn.addEventListener('click', function() {
        importModal.style.display = 'none';
    });
    
    // モーダル外をクリックしても閉じる
    window.addEventListener('click', function(event) {
        if (event.target === importModal) {
            importModal.style.display = 'none';
        }
    });
    
    // インポート実行
    confirmImportBtn.addEventListener('click', function() {
        const replaceData = document.getElementById('replace-data').checked;
        importData(replaceData);
        importModal.style.display = 'none';
    });
    
    // カテゴリの読み込み
    function loadCategories() {
        const incomeCategories = JSON.parse(localStorage.getItem('incomeCategories')) || [
            '給料', 'ボーナス', '副収入', 'その他収入'
        ];
        
        const expenseCategories = JSON.parse(localStorage.getItem('expenseCategories')) || [
            '食費', '住居費', '光熱費', '通信費', '交通費',
            '娯楽費', '医療費', '教育費', '貯蓄', '投資', 'その他支出'
        ];
        
        // 収入カテゴリのリストを更新
        renderCategoryList('income', incomeCategories);
        
        // 支出カテゴリのリストを更新
        renderCategoryList('expense', expenseCategories);
    }
    
    // カテゴリリストの描画
    function renderCategoryList(type, categories) {
        const listId = type === 'income' ? 'income-category-list' : 'expense-category-list';
        const categoryList = document.getElementById(listId);
        categoryList.innerHTML = '';
        
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <span>${category}</span>
                <button class="btn-icon delete-category" data-type="${type}" data-category="${category}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            categoryList.appendChild(categoryItem);
        });
        
        // 削除ボタンのイベント設定
        const deleteButtons = categoryList.querySelectorAll('.delete-category');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.dataset.type;
                const category = this.dataset.category;
                deleteCategory(type, category);
            });
        });
    }
    
    // カテゴリの追加
    function addCategory(type, category) {
        const storageKey = type === 'income' ? 'incomeCategories' : 'expenseCategories';
        let categories = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // 重複チェック
        if (categories.includes(category)) {
            alert('このカテゴリは既に存在します');
            return;
        }
        
        // カテゴリを追加
        categories.push(category);
        localStorage.setItem(storageKey, JSON.stringify(categories));
        
        // リストを更新
        renderCategoryList(type, categories);
    }
    
    // カテゴリの削除
    function deleteCategory(type, category) {
        const storageKey = type === 'income' ? 'incomeCategories' : 'expenseCategories';
        let categories = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // 最後の1つは削除できないようにする
        if (categories.length <= 1) {
            alert('少なくとも1つのカテゴリが必要です');
            return;
        }
        
        // カテゴリを削除
        categories = categories.filter(item => item !== category);
        localStorage.setItem(storageKey, JSON.stringify(categories));
        
        // リストを更新
        renderCategoryList(type, categories);
    }
    
    // アプリ設定の読み込み
    function loadAppSettings() {
        const settings = JSON.parse(localStorage.getItem('appSettings')) || {
            currency: 'JPY',
            dateFormat: 'YYYY/MM/DD',
            language: 'ja',
            darkMode: false
        };
        
        // フォームに値をセット
        document.getElementById('currency').value = settings.currency;
        document.getElementById('date-format').value = settings.dateFormat;
        document.getElementById('language').value = settings.language;
        document.getElementById('dark-mode').checked = settings.darkMode;
        
        // ダークモード設定の適用
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
    
    // アプリ設定の保存
    function saveAppSettings(settings) {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        
        // ダークモード設定の適用
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // データのエクスポート
    function exportData() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
        if (transactions.length === 0) {
            alert('エクスポートするデータがありません');
            return;
        }
        
        // CSVヘッダー
        let csv = '日付,カテゴリ,金額,メモ,タイプ\n';
        
        // データ行の追加
        transactions.forEach(transaction => {
            const type = transaction.amount > 0 ? '収入' : '支出';
            const amount = Math.abs(transaction.amount);
            const memo = transaction.memo ? `"${transaction.memo.replace(/"/g, '""')}"` : '';
            
            csv += `${transaction.date},${transaction.category},${amount},${memo},${type}\n`;
        });
        
        // CSVファイルのダウンロード
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const filename = `budget_export_${new Date().toISOString().slice(0, 10)}.csv`;
        
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    // インポートのプレビュー
    function previewImport(csv) {
        const lines = csv.split('\n');
        
        // ヘッダー行が含まれていることを確認
        if (lines.length < 2) {
            alert('有効なCSVデータではありません');
            return;
        }
        
        // ヘッダー行の解析
        const headers = lines[0].split(',');
        const requiredHeaders = ['日付', 'カテゴリ', '金額', 'タイプ'];
        
        // ヘッダーの検証
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
            alert(`必要なヘッダーがありません: ${missingHeaders.join(', ')}`);
            return;
        }
        
        // データの解析
        const importData = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            // CSV行の解析（簡易的な実装）
            const parseCSVLine = (line) => {
                const entries = [];
                let currentEntry = '';
                let withinQuotes = false;
                
                for (let j = 0; j < line.length; j++) {
                    const char = line[j];
                    
                    if (char === '"') {
                        withinQuotes = !withinQuotes;
                    } else if (char === ',' && !withinQuotes) {
                        entries.push(currentEntry);
                        currentEntry = '';
                    } else {
                        currentEntry += char;
                    }
                }
                
                entries.push(currentEntry);
                return entries;
            };
            
            const values = parseCSVLine(lines[i]);
            
            // 必要なデータの抽出
            const dateIndex = headers.indexOf('日付');
            const categoryIndex = headers.indexOf('カテゴリ');
            const amountIndex = headers.indexOf('金額');
            const memoIndex = headers.indexOf('メモ');
            const typeIndex = headers.indexOf('タイプ');
            
            const date = values[dateIndex];
            const category = values[categoryIndex];
            const amount = parseFloat(values[amountIndex]);
            const memo = memoIndex >= 0 && values[memoIndex] ? values[memoIndex] : '';
            const type = values[typeIndex];
            
            // データの検証
            if (!date || !category || isNaN(amount) || !type) continue;
            
            // データの変換
            const transaction = {
                date: date,
                category: category,
                amount: type === '収入' ? amount : -amount,
                memo: memo
            };
            
            importData.push(transaction);
        }
        
        // プレビューの表示
        const previewTable = document.getElementById('import-preview-table').querySelector('tbody');
        previewTable.innerHTML = '';
        
        const previewLimit = 10;
        const displayData = importData.slice(0, previewLimit);
        
        displayData.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.memo || '-'}</td>
            `;
            previewTable.appendChild(row);
        });
        
        // インポート数の表示
        document.getElementById('import-count').textContent = importData.length;
        
        // インポートデータを保存
        window.importData = importData;
        
        // モーダルを表示
        document.getElementById('import-modal').style.display = 'flex';
    }
    
    // データのインポート
    function importData(replaceData) {
        const importData = window.importData;
        
        if (!importData || importData.length === 0) {
            alert('インポートするデータがありません');
            return;
        }
        
        // 既存のデータを取得
        let transactions = replaceData ? [] : (JSON.parse(localStorage.getItem('transactions')) || []);
        
        // インポートデータの追加
        importData.forEach(transaction => {
            transactions.push({
                ...transaction,
                id: Date.now() + Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
            });
        });
        
        // データを保存
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        alert(`${importData.length}件のデータがインポートされました`);
    }
    
    // サンプルデータの追加
    function addSampleData() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // サンプルデータ
        const sampleData = [
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-05`,
                category: '給料',
                amount: 280000,
                memo: '4月分給料'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-10`,
                category: '住居費',
                amount: -85000,
                memo: '家賃'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-15`,
                category: '光熱費',
                amount: -12000,
                memo: '電気代'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-15`,
                category: '光熱費',
                amount: -8000,
                memo: 'ガス代'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-15`,
                category: '光熱費',
                amount: -3000,
                memo: '水道代'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-18`,
                category: '通信費',
                amount: -9800,
                memo: 'スマホ代'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-20`,
                category: '食費',
                amount: -35000,
                memo: '食料品'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-22`,
                category: '交通費',
                amount: -12000,
                memo: '定期券'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-23`,
                category: '娯楽費',
                amount: -15000,
                memo: '映画と食事'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-25`,
                category: '貯蓄',
                amount: -50000,
                memo: '積立'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-28`,
                category: '投資',
                amount: -30000,
                memo: '投資信託'
            },
            {
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-30`,
                category: 'ボーナス',
                amount: 150000,
                memo: '夏季ボーナス'
            }
        ];
        
        // 既存のデータを取得
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
        // サンプルデータの追加
        sampleData.forEach(transaction => {
            transactions.push({
                ...transaction,
                id: Date.now() + Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
            });
        });
        
        // データを保存
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        alert('サンプルデータが追加されました');
    }
    
    // データのリセット
    function resetData() {
        localStorage.removeItem('transactions');
        alert('すべてのデータがリセットされました');
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
});