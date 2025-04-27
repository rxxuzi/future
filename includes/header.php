<?php
// セッション開始
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// ログインしていない場合はログインページにリダイレクト
if (!isset($_SESSION['user_id']) && basename($_SERVER['PHP_SELF']) !== 'login.php') {
    header('Location: login.php');
    exit;
}

// 現在のページを取得
$current_page = basename($_SERVER['PHP_SELF'], '.php');
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Future</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="alternate icon" href="/favicon.ico">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js"></script>
</head>
<body>
    <div class="app-container">
        <!-- モバイルヘッダー -->
        <header class="mobile-header">
            <button id="mobile-menu-toggle" class="mobile-menu-toggle">
                <i class="fas fa-bars"></i>
            </button>
            <div class="app-logo">
                <i class="fas fa-chart-line"></i>
                <h1>Future</h1>
            </div>
            <button id="mobile-theme-toggle" class="mobile-theme-toggle">
                <i class="fas fa-moon"></i>
            </button>
        </header>
        
        <!-- サイドバー -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="app-logo">
                    <i class="fas fa-chart-line"></i>
                    <h1>Future</h1>
                </div>
                <button id="sidebar-close" class="sidebar-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="app-logo desktop-logo">
                <i class="fas fa-chart-line"></i>
                <h1>Future</h1>
            </div>
            
            <nav class="main-nav">
                <ul>
                    <li class="<?php echo $current_page === 'index' ? 'active' : ''; ?>">
                        <a href="index.php"><i class="fas fa-home"></i> ホーム</a>
                    </li>
                    <li>
                        <a href="#" id="show-transaction-modal"><i class="fas fa-plus-circle"></i> 新規追加</a>
                    </li>
                    <li class="<?php echo $current_page === 'history' ? 'active' : ''; ?>">
                        <a href="history.php"><i class="fas fa-history"></i> 履歴</a>
                    </li>
                    <li class="<?php echo $current_page === 'analytics' ? 'active' : ''; ?>">
                        <a href="analytics.php"><i class="fas fa-chart-pie"></i> 分析</a>
                    </li>
                    <li class="<?php echo $current_page === 'investments' ? 'active' : ''; ?>">
                        <a href="investments.php"><i class="fas fa-chart-line"></i> 投資</a>
                    </li>
                    <li class="<?php echo $current_page === 'settings' ? 'active' : ''; ?>">
                        <a href="settings.php"><i class="fas fa-cog"></i> 設定</a>
                    </li>
                </ul>
            </nav>
            
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                    <p><?php echo htmlspecialchars($_SESSION['username'] ?? 'ゲスト'); ?></p>
                    <a href="logout.php">ログアウト</a>
                </div>
            </div>
            
            <div class="theme-toggle">
                <button id="theme-toggle-btn">
                    <i class="fas fa-moon"></i>
                    <span>ダークモード切替</span>
                </button>
            </div>
        </aside>
        
        <!-- メインコンテンツ -->
        <main class="main-content">