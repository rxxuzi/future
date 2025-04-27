<?php
session_start();

// ログインしていない場合はエラー
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// データベース接続（実際の環境では設定が必要）
// $db = new PDO('mysql:host=localhost;dbname=budget_app', 'username', 'password');

// リクエストメソッドに基づいて処理を分岐
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // 取引データの取得
        getTransactions();
        break;
    case 'POST':
        // 新規取引の追加
        addTransaction();
        break;
    case 'PUT':
        // 取引の更新
        updateTransaction();
        break;
    case 'DELETE':
        // 取引の削除
        deleteTransaction();
        break;
    default:
        header('HTTP/1.1 405 Method Not Allowed');
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

// 取引データの取得
function getTransactions() {
    // クエリパラメータを取得
    $year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
    $month = isset($_GET['month']) ? intval($_GET['month']) : date('n');
    
    // 実際の環境ではデータベースからデータを取得
    /*
    $stmt = $db->prepare("
        SELECT * FROM transactions 
        WHERE user_id = :user_id 
        AND YEAR(date) = :year 
        AND MONTH(date) = :month
        ORDER BY date DESC
    ");
    $stmt->execute([
        'user_id' => $_SESSION['user_id'],
        'year' => $year,
        'month' => $month
    ]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    */
    
    // サンプルデータ
    $transactions = [
        [
            'id' => 1,
            'type' => 'income',
            'amount' => 250000,
            'category' => '給料',
            'date' => "$year-$month-05",
            'memo' => '4月分給料'
        ],
        [
            'id' => 2,
            'type' => 'expense',
            'amount' => -85000,
            'category' => '住居費',
            'date' => "$year-$month-10",
            'memo' => '家賃'
        ],
        [
            'id' => 3,
            'type' => 'expense',
            'amount' => -12000,
            'category' => '光熱費',
            'date' => "$year-$month-15",
            'memo' => '電気代'
        ],
        [
            'id' => 4,
            'type' => 'expense',
            'amount' => -30000,
            'category' => '食費',
            'date' => "$year-$month-20",
            'memo' => '今月の食費'
        ],
        [
            'id' => 5,
            'type' => 'expense',
            'amount' => -15000,
            'category' => '娯楽費',
            'date' => "$year-$month-25",
            'memo' => '映画と食事'
        ]
    ];
    
    // JSONとして返す
    header('Content-Type: application/json');
    echo json_encode(['transactions' => $transactions]);
}

// 新規取引の追加
function addTransaction() {
    // JSONデータを取得
    $data = json_decode(file_get_contents('php://input'), true);
    
    // データバリデーション
    if (!isset($data['amount']) || !isset($data['category']) || !isset($data['date'])) {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    // 実際の環境ではデータベースに保存
    /*
    $stmt = $db->prepare("
        INSERT INTO transactions (user_id, amount, category, date, memo) 
        VALUES (:user_id, :amount, :category, :date, :memo)
    ");
    $result = $stmt->execute([
        'user_id' => $_SESSION['user_id'],
        'amount' => $data['amount'],
        'category' => $data['category'],
        'date' => $data['date'],
        'memo' => $data['memo'] ?? ''
    ]);
    
    if ($result) {
        $data['id'] = $db->lastInsertId();
        header('HTTP/1.1 201 Created');
        echo json_encode(['transaction' => $data]);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => 'Failed to save transaction']);
    }
    */
    
    // サンプルレスポンス
    $data['id'] = rand(100, 999);
    header('HTTP/1.1 201 Created');
    echo json_encode(['transaction' => $data]);
}

// 取引の更新
function updateTransaction() {
    // JSONデータを取得
    $data = json_decode(file_get_contents('php://input'), true);
    
    // データバリデーション
    if (!isset($data['id'])) {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Missing transaction ID']);
        return;
    }
    
    // 実際の環境ではデータベースを更新
    /*
    $stmt = $db->prepare("
        UPDATE transactions 
        SET amount = :amount, category = :category, date = :date, memo = :memo 
        WHERE id = :id AND user_id = :user_id
    ");
    $result = $stmt->execute([
        'amount' => $data['amount'],
        'category' => $data['category'],
        'date' => $data['date'],
        'memo' => $data['memo'] ?? '',
        'id' => $data['id'],
        'user_id' => $_SESSION['user_id']
    ]);
    
    if ($result && $stmt->rowCount() > 0) {
        header('HTTP/1.1 200 OK');
        echo json_encode(['transaction' => $data]);
    } else {
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['error' => 'Transaction not found or no changes made']);
    }
    */
    
    // サンプルレスポンス
    header('HTTP/1.1 200 OK');
    echo json_encode(['transaction' => $data]);
}

// 取引の削除
function deleteTransaction() {
    // JSONデータを取得
    $data = json_decode(file_get_contents('php://input'), true);
    
    // データバリデーション
    if (!isset($data['id'])) {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Missing transaction ID']);
        return;
    }
    
    // 実際の環境ではデータベースから削除
    /*
    $stmt = $db->prepare("
        DELETE FROM transactions 
        WHERE id = :id AND user_id = :user_id
    ");
    $result = $stmt->execute([
        'id' => $data['id'],
        'user_id' => $_SESSION['user_id']
    ]);
    
    if ($result && $stmt->rowCount() > 0) {
        header('HTTP/1.1 200 OK');
        echo json_encode(['success' => true]);
    } else {
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['error' => 'Transaction not found']);
    }
    */
    
    // サンプルレスポンス
    header('HTTP/1.1 200 OK');
    echo json_encode(['success' => true]);
}