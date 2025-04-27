<?php
include_once 'includes/header.php';
?>
<header class="main-header">
    <h2>収支分析</h2>
    <div class="date-filter">
        <label for="date-range"></label><select id="date-range">
            <option value="month">月次</option>
            <option value="quarter">四半期</option>
            <option value="year">年次</option>
            <option value="custom">カスタム</option>
        </select>
        <button id="date-prev"><i class="fas fa-chevron-left"></i></button>
        <span id="current-date-range">2025年4月</span>
        <button id="date-next"><i class="fas fa-chevron-right"></i></button>
    </div>
</header>

<div class="analytics-dashboard">
    <!-- 収支サマリー -->
    <div class="card summary-card">
        <div class="card-header">
            <h3>収支サマリー</h3>
        </div>
        <div class="card-body">
            <div class="summary-stats">
                <div class="summary-item">
                    <div class="summary-label">総収入</div>
                    <div class="summary-value income" id="total-income">¥0</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">総支出</div>
                    <div class="summary-value expense" id="total-expense">¥0</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">貯蓄</div>
                    <div class="summary-value" id="total-savings">¥0</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">貯蓄率</div>
                    <div class="summary-value" id="savings-rate">0%</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 貯蓄推移 -->
    <div class="card savings-trend-card">
        <div class="card-header">
            <h3>貯蓄推移</h3>
        </div>
        <div class="card-body">
            <canvas id="savingsTrendChart"></canvas>
        </div>
    </div>
    
    <!-- カテゴリ別支出 -->
    <div class="card category-expense-card">
        <div class="card-header">
            <h3>カテゴリ別支出</h3>
        </div>
        <div class="card-body">
            <canvas id="categoryExpenseChart"></canvas>
        </div>
    </div>
    
    <!-- 月次推移 -->
    <div class="card trend-card">
        <div class="card-header">
            <h3>月次推移</h3>
        </div>
        <div class="card-body">
            <canvas id="trendChart"></canvas>
        </div>
    </div>
    
    <!-- 週別支出 -->
    <div class="card weekly-expense-card">
        <div class="card-header">
            <h3>週別支出</h3>
        </div>
        <div class="card-body">
            <canvas id="weeklyExpenseChart"></canvas>
        </div>
    </div>
    
    <!-- 予算と実績 -->
    <div class="card budget-performance-card">
        <div class="card-header">
            <h3>予算と実績</h3>
            <button id="set-budget" class="btn btn-sm">予算設定</button>
        </div>
        <div class="card-body">
            <div class="budget-performance-list" id="budget-performance-list">
                <!-- JavaScriptで動的に表示 -->
            </div>
        </div>
    </div>
    
    <!-- 主要支出項目 -->
    <div class="card top-expenses-card">
        <div class="card-header">
            <h3>主要支出</h3>
        </div>
        <div class="card-body">
            <div class="top-expenses-list" id="top-expenses-list">
                <!-- JavaScriptで動的に表示 -->
            </div>
        </div>
    </div>
</div>

<!-- 予算設定モーダル -->
<div class="modal" id="budget-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>予算設定</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="budget-form">
                <div class="budget-categories">
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block">保存</button>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="js/app.js"></script>
<script src="js/analytics.js"></script>

<?php
include_once 'includes/footer.php';
?>