<?php
session_start();

// ログインしていない場合はエラー
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Database.phpをインクルード
require_once __DIR__ . '/../includes/Database.php';

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
    $all = isset($_GET['all']) && $_GET['all'] === 'true';

    try {
        $db = Database::getInstance();

        if ($all) {
            // 全ての取引を取得
            $sql = "SELECT * FROM transactions WHERE user_id = :user_id ORDER BY date DESC";
            $params = ['user_id' => $_SESSION['user_id']];
        } else {
            // 特定月の取引を取得
            $sql = "SELECT * FROM transactions 
                    WHERE user_id = :user_id 
                    AND YEAR(date) = :year 
                    AND MONTH(date) = :month
                    ORDER BY date DESC";
            $params = [
                'user_id' => $_SESSION['user_id'],
                'year' => $year,
                'month' => $month
            ];
        }

        $transactions = $db->fetchAll($sql, $params);

        // 結果を返す
        header('Content-Type: application/json');
        echo json_encode(['transactions' => $transactions]);

    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
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

    try {
        $db = Database::getInstance();

        // トランザクションデータ準備
        $transaction = [
            'user_id' => $_SESSION['user_id'],
            'amount' => $data['amount'],
            'category' => $data['category'],
            'date' => $data['date'],
            'memo' => isset($data['memo']) ? $data['memo'] : ''
        ];

        // データベースに保存
        $id = $db->insert('transactions', $transaction);

        if ($id) {
            $transaction['id'] = $id;
            header('HTTP/1.1 201 Created');
            echo json_encode(['transaction' => $transaction]);
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(['error' => 'Failed to save transaction']);
        }

    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
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

    try {
        $db = Database::getInstance();

        // 更新データ準備
        $updateData = [
            'amount' => $data['amount'],
            'category' => $data['category'],
            'date' => $data['date'],
            'memo' => isset($data['memo']) ? $data['memo'] : ''
        ];

        // データベースを更新
        $result = $db->update(
            'transactions',
            $updateData,
            'id = :id AND user_id = :user_id',
            ['id' => $data['id'], 'user_id' => $_SESSION['user_id']]
        );

        if ($result) {
            header('HTTP/1.1 200 OK');
            echo json_encode(['transaction' => $data]);
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Transaction not found or no changes made']);
        }

    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
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

    try {
        $db = Database::getInstance();

        // データベースから削除
        $result = $db->delete(
            'transactions',
            'id = :id AND user_id = :user_id',
            ['id' => $data['id'], 'user_id' => $_SESSION['user_id']]
        );

        if ($result) {
            header('HTTP/1.1 200 OK');
            echo json_encode(['success' => true]);
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Transaction not found']);
        }

    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// バッチインポート関数（複数のトランザクションをまとめて保存）
function batchImportTransactions($transactions) {
    try {
        $db = Database::getInstance();
        $db->beginTransaction();

        $count = 0;
        foreach ($transactions as $transaction) {
            $transactionData = [
                'user_id' => $_SESSION['user_id'],
                'amount' => $transaction['amount'],
                'category' => $transaction['category'],
                'date' => $transaction['date'],
                'memo' => isset($transaction['memo']) ? $transaction['memo'] : ''
            ];

            $db->insert('transactions', $transactionData);
            $count++;
        }

        $db->commit();
        return $count;
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }
}