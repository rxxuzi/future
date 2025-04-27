<?php
include_once 'includes/header.php';
?>
<header class="main-header">
    <h2>取引履歴</h2>
    <div class="date-filter">
        <button id="date-prev"><i class="fas fa-chevron-left"></i></button>
        <span id="current-date-range">2025年4月</span>
        <button id="date-next"><i class="fas fa-chevron-right"></i></button>
    </div>
</header>

<div class="content-wrapper">
    <div class="filters">
        <div class="filter-group">
            <label for="type-filter">タイプ:</label>
            <select id="type-filter">
                <option value="all">すべて</option>
                <option value="income">収入</option>
                <option value="expense">支出</option>
            </select>
        </div>
        
        <div class="filter-group">
            <label for="category-filter">カテゴリ:</label>
            <select id="category-filter">
                <option value="all">すべて</option>
                <optgroup label="収入">
                    <option value="給料">給料</option>
                    <option value="ボーナス">ボーナス</option>
                    <option value="副収入">副収入</option>
                    <option value="その他収入">その他収入</option>
                </optgroup>
                <optgroup label="支出">
                    <option value="食費">食費</option>
                    <option value="住居費">住居費</option>
                    <option value="光熱費">光熱費</option>
                    <option value="通信費">通信費</option>
                    <option value="交通費">交通費</option>
                    <option value="娯楽費">娯楽費</option>
                    <option value="医療費">医療費</option>
                    <option value="教育費">教育費</option>
                    <option value="貯蓄">貯蓄</option>
                    <option value="投資">投資</option>
                    <option value="その他支出">その他支出</option>
                </optgroup>
            </select>
        </div>
        
        <div class="filter-group">
            <label for="sort-filter">並び替え:</label>
            <select id="sort-filter">
                <option value="date-desc">日付（新しい順）</option>
                <option value="date-asc">日付（古い順）</option>
                <option value="amount-desc">金額（高い順）</option>
                <option value="amount-asc">金額（低い順）</option>
            </select>
        </div>
        
        <div class="filter-group search">
            <input type="text" id="search-filter" placeholder="メモで検索...">
            <button id="search-btn"><i class="fas fa-search"></i></button>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header">
            <h3>取引リスト</h3>
            <div class="card-actions">
                <button id="export-csv" class="btn btn-secondary">
                    <i class="fas fa-download"></i> CSVエクスポート
                </button>
            </div>
        </div>
        <div class="card-body">
            <table class="transactions-table">
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>カテゴリ</th>
                        <th>メモ</th>
                        <th>金額</th>
                        <th>アクション</th>
                    </tr>
                </thead>
                <tbody id="transactions-table-body">
                    <!-- JavaScriptで動的に表示 -->
                </tbody>
            </table>
            
            <div class="pagination" id="pagination">
                <!-- JavaScriptで動的に表示 -->
            </div>
        </div>
    </div>
</div>

<!-- 取引編集モーダル -->
<div class="modal" id="edit-transaction-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>取引を編集</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="edit-transaction-form">
                <input type="hidden" id="edit-id" name="id">
                
                <div class="transaction-type">
                    <button type="button" class="transaction-type-btn" data-type="income">
                        <i class="fas fa-plus"></i> 収入
                    </button>
                    <button type="button" class="transaction-type-btn" data-type="expense">
                        <i class="fas fa-minus"></i> 支出
                    </button>
                </div>
                
                <div class="form-group">
                    <label for="edit-amount">金額</label>
                    <input type="number" id="edit-amount" name="amount" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-category">カテゴリ</label>
                    <select id="edit-category" name="category">
                        <optgroup label="収入" id="edit-income-categories">
                            <option value="給料">給料</option>
                            <option value="ボーナス">ボーナス</option>
                            <option value="副収入">副収入</option>
                            <option value="その他収入">その他収入</option>
                        </optgroup>
                        <optgroup label="支出" id="edit-expense-categories">
                            <option value="食費">食費</option>
                            <option value="住居費">住居費</option>
                            <option value="光熱費">光熱費</option>
                            <option value="通信費">通信費</option>
                            <option value="交通費">交通費</option>
                            <option value="娯楽費">娯楽費</option>
                            <option value="医療費">医療費</option>
                            <option value="教育費">教育費</option>
                            <option value="貯蓄">貯蓄</option>
                            <option value="投資">投資</option>
                            <option value="その他支出">その他支出</option>
                        </optgroup>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-date">日付</label>
                    <input type="date" id="edit-date" name="date" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-memo">メモ</label>
                    <textarea id="edit-memo" name="memo" rows="3"></textarea>
                </div>
                
                <div class="form-group button-group">
                    <button type="submit" class="btn btn-primary">更新</button>
                    <button type="button" id="delete-transaction" class="btn btn-danger">削除</button>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="js/app.js"></script>
<script src="js/history.js"></script>

<?php
include_once 'includes/footer.php';
?>