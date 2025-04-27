<?php
include_once 'includes/header.php';
?>

    <header class="main-header">
        <h2>ダッシュボード</h2>
        <div class="date-filter">
            <button id="date-prev"><i class="fas fa-chevron-left"></i></button>
            <span id="current-date-range"></span>
            <button id="date-next"><i class="fas fa-chevron-right"></i></button>
        </div>
    </header>

    <div class="dashboard">
        <!-- 残高サマリー -->
        <div class="card balance-summary">
            <div class="card-body">
                <div class="balance-amount" id="current-balance">¥0</div>
                <div class="balance-stats">
                    <div class="stat income">
                        <i class="fas fa-arrow-up"></i>
                        <div class="stat-data">
                            <span class="stat-label">収入</span>
                            <span class="stat-value" id="total-income">¥0</span>
                        </div>
                    </div>
                    <div class="stat expense">
                        <i class="fas fa-arrow-down"></i>
                        <div class="stat-data">
                            <span class="stat-label">支出</span>
                            <span class="stat-value" id="total-expense">¥0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 総貯蓄額 -->
        <div class="card total-savings">
            <div class="card-header">
                <h3>総貯蓄額</h3>
                <button id="edit-savings-target" class="btn-sm"><i class="fas fa-edit"></i> 目標編集</button>
            </div>
            <div class="card-body">
                <div class="savings-amount" id="total-savings-amount">¥0</div>
                <div class="savings-progress">
                    <div class="progress-info">
                        <span>目標: <span id="savings-target-text">¥3,000,000</span></span>
                        <span>進捗: <span id="savings-progress-percentage">0%</span></span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="savings-progress-bar" style="width: 0%"></div>
                    </div>
                </div>
                <div class="savings-chart-container">
                    <canvas id="savingsGrowthChart"></canvas>
                </div>
            </div>
        </div>

        <!-- 残高推移グラフ -->
        <div class="card balance-chart">
            <div class="card-header">
                <h3>残高推移</h3>
            </div>
            <div class="card-body">
                <canvas id="balanceChart"></canvas>
            </div>
        </div>

        <!-- 支出カテゴリ -->
        <div class="card expense-category">
            <div class="card-header">
                <h3>支出カテゴリ</h3>
            </div>
            <div class="card-body">
                <canvas id="expensePieChart"></canvas>
            </div>
        </div>

        <!-- 最近の取引 -->
        <div class="card recent-transactions">
            <div class="card-header">
                <h3>最近の取引</h3>
                <a href="history.php" id="view-all-transactions">すべて表示</a>
            </div>
            <div class="card-body">
                <div class="transaction-list" id="recent-transactions-list">
                    <!-- 取引データはJavaScriptで動的に表示 -->
                </div>
            </div>
        </div>
    </div>

    <!-- 貯蓄目標編集モーダル -->
    <div class="modal" id="savings-target-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>貯蓄目標の編集</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="savings-target-form">
                    <div class="form-group">
                        <label for="savings-target-amount">目標金額</label>
                        <input type="number" id="savings-target-amount" name="target-amount" min="1000" step="1000" required>
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-block">保存</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="js/api.js"></script>
    <script src="js/app.js"></script>
    <script src="js/index.js"></script>

<?php
include_once 'includes/footer.php';
?>