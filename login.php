<?php
session_start();

// 既にログインしている場合はホームページにリダイレクト
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

// ログイン処理
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // 実際の環境ではデータベースから認証するべきですが、
    // 例として固定のユーザー名とパスワードを使用します
    if ($username === 'rxxuzi' && $password === 'password') {
        $_SESSION['user_id'] = 1;
        $_SESSION['username'] = 'rxxuzi';
        header('Location: index.php');
        exit;
    } else {
        $error = 'ユーザー名またはパスワードが正しくありません。';
    }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン - Budget</title>
    <link rel="stylesheet" href="css/style.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
</head>
<body>
    <div class="container login-container">
        <div class="login-box">
            <div class="app-logo">
                <i class="fas fa-wallet"></i>
                <h1>Budget</h1>
            </div>
            <h2>ログイン</h2>
            
            <?php if ($error): ?>
                <div class="alert alert-danger"><?php echo $error; ?></div>
            <?php endif; ?>
            
            <form method="post" action="login.php">
                <div class="form-group">
                    <label for="username">ユーザー名</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">パスワード</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block">ログイン</button>
                </div>
            </form>
            
            <div class="theme-toggle">
                <button id="theme-toggle-btn">
                    <i class="fas fa-moon"></i>
                    <span>ダークモード切替</span>
                </button>
            </div>
        </div>
    </div>
    
    <script src="js/theme.js"></script>
</body>
</html>