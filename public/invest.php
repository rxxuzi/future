<?php
include_once 'includes/header.php';
?>

<header class="main-header">
    <h2>投資管理</h2>
    <div class="date-filter">
        <label for="date-range"></label>
        <select id="date-range">
            <option value="1m">1ヶ月</option>
            <option value="3m">3ヶ月</option>
            <option value="6m">6ヶ月</option>
            <option value="1y" selected>1年</option>
            <option value="all">全期間</option>
        </select>
    </div>
</header>

<div class="investments-dashboard">
    <!-- 投資概要 -->
    <div class="card investment-summary-card">
        <div class="card-header">
            <h3>投資概要</h3>
        </div>
        <div class="card-body">
            <div class="investment-stats">
                <div class="investment-stat-item">
                    <div class="stat-label">総投資額</div>
                    <div class="stat-value" id="total-investment">¥0</div>
                </div>
                <div class="investment-stat-item">
                    <div class="stat-label">現在価値</div>
                    <div class="stat-value" id="current-investment-value">¥0</div>
                </div>
                <div class="investment-stat-item">
                    <div class="stat-label">総利益</div>
                    <div class="stat-value profit" id="total-profit">¥0</div>
                </div>
                <div class="investment-stat-item">
                    <div class="stat-label">リターン率</div>
                    <div class="stat-value profit" id="total-return">0.0%</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 資産配分 -->
    <div class="card asset-allocation-card">
        <div class="card-header">
            <h3>資産配分</h3>
        </div>
        <div class="card-body">
            <div class="asset-allocation-chart-container">
                <canvas id="assetAllocationChart"></canvas>
            </div>
        </div>
    </div>
    
    <!-- 投資パフォーマンス -->
    <div class="card investment-performance-card">
        <div class="card-header">
            <h3>投資パフォーマンス</h3>
        </div>
        <div class="card-body">
            <div class="investment-performance-chart-container">
                <canvas id="investmentPerformanceChart"></canvas>
            </div>
        </div>
    </div>
    
    <!-- 投資ポートフォリオ -->
    <div class="card investment-portfolio-card">
        <div class="card-header">
            <h3>投資ポートフォリオ</h3>
            <button id="add-investment-btn" class="btn-sm">
                <i class="fas fa-plus"></i> 追加
            </button>
        </div>
        <div class="card-body">
            <div class="portfolio-table-container">
                <table class="portfolio-table">
                    <thead>
                        <tr>
                            <th>投資先</th>
                            <th>種類</th>
                            <th>購入価格</th>
                            <th>現在価値</th>
                            <th>保有数</th>
                            <th>利益</th>
                            <th>リターン</th>
                            <th>アクション</th>
                        </tr>
                    </thead>
                    <tbody id="portfolio-table-body">
                        <tr>
                            <td>
                                <div class="investment-name">米国株式インデックス</div>
                                <div class="investment-code">VTI</div>
                            </td>
                            <td>ETF</td>
                            <td>¥20,000</td>
                            <td>¥22,000</td>
                            <td>5</td>
                            <td class="profit">¥10,000</td>
                            <td class="profit">10.0%</td>
                            <td>
                                <button class="btn-icon edit-investment" data-id="1">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- 投資目標 -->
    <div class="card investment-goals-card">
        <div class="card-header">
            <h3>投資目標</h3>
            <button id="add-goal-btn" class="btn-sm">
                <i class="fas fa-plus"></i> 追加
            </button>
        </div>
        <div class="card-body">
            <div class="investment-goals-list">
                <div class="investment-goal-item">
                    <div class="goal-header">
                        <div class="goal-title">老後資金</div>
                        <div class="goal-target">目標: ¥30,000,000</div>
                    </div>
                    <div class="goal-progress-info">
                        <div class="goal-current">現在: ¥5,000,000 (16.7%)</div>
                        <div class="goal-date">目標日: 2050年</div>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="progress-bar" style="width: 16.7%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 最近の投資取引 -->
    <div class="card recent-investment-transactions-card">
        <div class="card-header">
            <h3>最近の投資取引</h3>
        </div>
        <div class="card-body">
            <div class="investment-transaction-list">
                <div class="investment-transaction-item">
                    <div class="transaction-icon buy">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-title">米国株式インデックス (VTI)</div>
                        <div class="transaction-info">
                            <span class="transaction-date">2025/04/15</span>
                            <span class="transaction-quantity">2 口</span>
                            <span class="transaction-price">¥20,000</span>
                        </div>
                    </div>
                    <div class="transaction-amount buy">¥40,000</div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 投資追加・編集モーダル -->
<div class="modal" id="investment-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="investment-modal-title">投資を追加</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="investment-form">
                <input type="hidden" id="investment-id" name="investment-id">
                
                <div class="form-group">
                    <label for="investment-name">投資名</label>
                    <input type="text" id="investment-name" name="investment-name" required>
                </div>
                
                <div class="form-group">
                    <label for="investment-code">証券コード/ティッカー</label>
                    <input type="text" id="investment-code" name="investment-code" required>
                </div>
                
                <div class="form-group">
                    <label for="investment-type">投資種類</label>
                    <select id="investment-type" name="investment-type" required>
                        <option value="株式">株式</option>
                        <option value="投資信託">投資信託</option>
                        <option value="ETF">ETF</option>
                        <option value="債券">債券</option>
                        <option value="不動産">不動産</option>
                        <option value="暗号資産">暗号資産</option>
                        <option value="その他">その他</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="investment-price">購入価格（1口あたり）</label>
                    <input type="number" id="investment-price" name="investment-price" min="0" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="investment-quantity">保有数</label>
                    <input type="number" id="investment-quantity" name="investment-quantity" min="0.01" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="investment-date">購入日</label>
                    <input type="date" id="investment-date" name="investment-date" required>
                </div>
                
                <div class="form-group button-group">
                    <button type="submit" class="btn btn-primary">保存</button>
                    <button type="button" id="delete-investment" class="btn btn-danger">削除</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- 投資目標追加モーダル -->
<div class="modal" id="investment-goal-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>投資目標の追加</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="investment-goal-form">
                <div class="form-group">
                    <label for="goal-title">目標名</label>
                    <input type="text" id="goal-title" name="goal-title" required>
                </div>
                
                <div class="form-group">
                    <label for="goal-target-amount">目標金額</label>
                    <input type="number" id="goal-target-amount" name="goal-target-amount" min="1000" step="1000" required>
                </div>
                
                <div class="form-group">
                    <label for="goal-current-amount">現在の貯蓄額</label>
                    <input type="number" id="goal-current-amount" name="goal-current-amount" min="0" step="1000" required>
                </div>
                
                <div class="form-group">
                    <label for="goal-target-date">目標日</label>
                    <input type="date" id="goal-target-date" name="goal-target-date" required>
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
<script src="js/investments.js"></script>

<?php
include_once 'includes/footer.php';
?>