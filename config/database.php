<?php
// データベース接続設定
return [
    'host' => 'localhost',
    'dbname' => 'future_app',
    'username' => 'root',  // 実際の環境では変更してください
    'password' => '',      // 実際の環境では変更してください
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];