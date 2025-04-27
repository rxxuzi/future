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

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getSavingsTarget();
        break;
    case 'PUT':
        updateSavingsTarget();
        break;
    default:
        header('HTTP/1.1 405 Method Not Allowed');
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

// 貯蓄目標を取得
function getSavingsTarget() {
    try {
        $db = Database::getInstance();

        // データベースから貯蓄目標を取得
        $sql = "SELECT * FROM savings_goals WHERE user_id = :user_id AND name = '総貯蓄目標' ORDER BY created_at DESC LIMIT 1";
        $target = $db->fetch($sql, ['user_id' => $_SESSION['user_id']]);

        // 目標がない場合はデフォルト値を返す
        if (!$target) {
            $target = [
                'name' => '総貯蓄目標',
                'target_amount' => 3000000,
                'current_amount' => 0,
                'target_date' => null
            ];
        }

        // 結果を返す
        header('Content-Type: application/json');
        echo json_encode(['target' => $target]);

    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// 貯蓄目標を更新
function updateSavingsTarget() {
    // JSONデータを取得
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // データバリデーション
    if (!isset($data['target']) || !isset($data['target']['target_amount'])) {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    try {
        $db = Database::getInstance();

        // 既存の目標を確認
        $sql = "SELECT id FROM savings_goals WHERE user_id = :user_id AND name = '総貯蓄目標'";
        $existing = $db->fetch($sql, ['user_id' => $_SESSION['user_id']]);

        if ($existing) {
            // 既存の目標を更新
            $result = $db->update('savings_goals',
                [
                    'target_amount' => $data['target']['target_amount'],
                    'current_amount' => $data['target']['current_amount'] ?? 0
                ],
                'id = :id',
                ['id' => $existing['id']]
            );

            if ($result) {
                header('HTTP/1.1 200 OK');
                echo json_encode(['success' => true, 'target' => $data['target']]);
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                echo json_encode(['error' => 'Failed to update savings target']);
            }
        } else {
            // 新しい目標を作成
            $newTarget = [
                'user_id' => $_SESSION['user_id'],
                'name' => '総貯蓄目標',
                'target_amount' => $data['target']['target_amount'],
                'current_amount' => $data['target']['current_amount'] ?? 0
            ];

            if (isset($data['target']['target_date'])) {
                $newTarget['target_date'] = $data['target']['target_date'];
            }

            $id = $db->insert('savings_goals', $newTarget);

            if ($id) {
                $newTarget['id'] = $id;
                header('HTTP/1.1 201 Created');
                echo json_encode(['success' => true, 'target' => $newTarget]);
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                echo json_encode(['error' => 'Failed to create savings target']);
            }
        }
    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
}