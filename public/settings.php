<?php
include_once 'includes/header.php';
?>
<header class="main-header">
    <h2>設定</h2>
</header>

<div class="content-wrapper">
    <div class="card">
        <div class="card-header">
            <h3>アカウント設定</h3>
        </div>
        <div class="card-body">
            <form id="account-form" class="settings-form">
                <div class="form-group">
                    <label for="username">ユーザー名</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($_SESSION['username']); ?>" readonly>
                </div>
                
                <div class="form-group">
                    <label for="current-password">現在のパスワード</label>
                    <input type="password" id="current-password" name="current-password">
                </div>
                
                <div class="form-group">
                    <label for="new-password">新しいパスワード</label>
                    <input type="password" id="new-password" name="new-password">
                </div>
                
                <div class="form-group">
                    <label for="confirm-password">パスワード確認</label>
                    <input type="password" id="confirm-password" name="confirm-password">
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">パスワード変更</button>
                </div>
            </form>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header">
            <h3>カテゴリ設定</h3>
        </div>
        <div class="card-body">
            <div class="tab-group">
                <button class="tab-btn active" data-type="income">収入カテゴリ</button>
                <button class="tab-btn" data-type="expense">支出カテゴリ</button>
            </div>
            
            <div class="tab-content">
                <div class="tab-pane active" id="income-categories-pane">
                    <div class="category-list" id="income-category-list">
                        <!-- JavaScriptで動的に表示 -->
                    </div>
                    
                    <form id="add-income-category-form" class="add-category-form">
                        <div class="form-group">
                            <input type="text" id="new-income-category" name="new-income-category" placeholder="新しいカテゴリ名" required>
                            <button type="submit" class="btn btn-primary">追加</button>
                        </div>
                    </form>
                </div>
                
                <div class="tab-pane" id="expense-categories-pane">
                    <div class="category-list" id="expense-category-list">
                        <!-- JavaScriptで動的に表示 -->
                    </div>
                    
                    <form id="add-expense-category-form" class="add-category-form">
                        <div class="form-group">
                            <input type="text" id="new-expense-category" name="new-expense-category" placeholder="新しいカテゴリ名" required>
                            <button type="submit" class="btn btn-primary">追加</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header">
            <h3>アプリ設定</h3>
        </div>
        <div class="card-body">
            <form id="app-settings-form" class="settings-form">
                <div class="form-group">
                    <label for="currency">通貨</label>
                    <select id="currency" name="currency">
                        <option value="JPY">日本円 (¥)</option>
                        <option value="USD">米ドル ($)</option>
                        <option value="EUR">ユーロ (€)</option>
                        <option value="GBP">英ポンド (£)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="date-format">日付形式</label>
                    <select id="date-format" name="date-format">
                        <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="language">言語</label>
                    <select id="language" name="language">
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="dark-mode" name="dark-mode">
                        <span>常にダークモードを使用</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">設定を保存</button>
                </div>
            </form>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header">
            <h3>データ管理</h3>
        </div>
        <div class="card-body">
            <div class="settings-actions">
                <div class="action-item">
                    <div class="action-info">
                        <h4>データのエクスポート</h4>
                        <p>すべての取引データをCSV形式でエクスポートします。</p>
                    </div>
                    <button id="export-data" class="btn btn-secondary">エクスポート</button>
                </div>
                
                <div class="action-item">
                    <div class="action-info">
                        <h4>データのインポート</h4>
                        <p>CSVファイルから取引データをインポートします。</p>
                    </div>
                    <label for="import-file" class="btn btn-secondary">インポート</label>
                    <input type="file" id="import-file" accept=".csv" style="display: none;">
                </div>
                
                <div class="action-item">
                    <div class="action-info">
                        <h4>サンプルデータの追加</h4>
                        <p>テスト用のサンプルデータを追加します。</p>
                    </div>
                    <button id="add-sample-data" class="btn btn-secondary">サンプル追加</button>
                </div>
                
                <div class="action-item">
                    <div class="action-info">
                        <h4>すべてのデータをリセット</h4>
                        <p>すべての取引データを削除します。この操作は元に戻せません。</p>
                    </div>
                    <button id="reset-data" class="btn btn-danger">リセット</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- インポート確認モーダル -->
<div class="modal" id="import-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>データインポート</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="import-preview">
                <h4>インポートプレビュー</h4>
                <p class="import-summary">読み込まれたレコード: <span id="import-count">0</span></p>
                <div class="table-container">
                    <table class="preview-table" id="import-preview-table">
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th>カテゴリ</th>
                                <th>金額</th>
                                <th>メモ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- JavaScriptで動的に表示 -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="import-options">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="replace-data">
                        <span>既存のデータを置き換える</span>
                    </label>
                </div>
                <div class="form-group">
                    <button id="confirm-import" class="btn btn-primary">インポート実行</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="js/app.js"></script>
<script src="js/settings.js"></script>

<?php
include_once 'includes/footer.php';
?>