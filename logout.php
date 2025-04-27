<?php
session_start();

// セッションを破棄
session_destroy();

// クッキーを削除
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 86400, '/');
}

// ログインページにリダイレクト
header('Location: login.php');
exit;
?>