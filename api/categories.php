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

// メソッドに基づいて処理
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    getCategories();
} else {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['error' => 'Method not allowed']);
}

// カテゴリ取得
function getCategories() {
    $type = isset($_GET['type']) ? $_GET['type'] : null;

    try {
        $db = Database::getInstance();

        // クエリ条件の設定
        $where = "user_id = :user_id";
        $params = ['user_id' => $_SESSION['user_id']];

        // タイプ（収入/支出）でフィルタリング
        if ($type && in_array($type, ['income', 'expense'])) {
            $where .= " AND type = :type";
            $params['type'] = $type;
        }

        // データベースからカテゴリを取得
        $sql = "SELECT id, name, type, color FROM categories WHERE $where ORDER BY name";
        $categories = $db->fetchAll($sql, $params);

        // 実データベースが使用できない場合のサンプルデータ
        if (empty($categories)) {
            if ($type === 'income' || !$type) {
                $incomeCategories = [
                    ['id' => 1, 'name' => '給料', 'type' => 'income', 'color' => '#4361ee'],
                    ['id' => 2, 'name' => 'ボーナス', 'type' => 'income', 'color' => '#3a0ca3'],
                    ['id' => 3, 'name' => '副収入', 'type' => 'income', 'color' => '#7209b7'],
                    ['id' => 4, 'name' => 'その他収入', 'type' => 'income', 'color' => '#f72585']
                ];

                if ($type === 'income') {
                    $categories = $incomeCategories;
                } else {
                    $categories = array_merge($categories, $incomeCategories);
                }
            }

            if ($type === 'expense' || !$type) {
                $expenseCategories = [
                    ['id' => 5, 'name' => '食費', 'type' => 'expense', 'color' => '#4cc9f0'],
                    ['id' => 6, 'name' => '住居費', 'type' => 'expense', 'color' => '#4895ef'],
                    ['id' => 7, 'name' => '光熱費', 'type' => 'expense', 'color' => '#560bad'],
                    ['id' => 8, 'name' => '通信費', 'type' => 'expense', 'color' => '#f3722c'],
                    ['id' => 9, 'name' => '交通費', 'type' => 'expense', 'color' => '#f8961e'],
                    ['id' => 10, 'name' => '娯楽費', 'type' => 'expense', 'color' => '#f9c74f'],
                    ['id' => 11, 'name' => '医療費', 'type' => 'expense', 'color' => '#90be6d'],
                    ['id' => 12, 'name' => '教育費', 'type' => 'expense', 'color' => '#43aa8b'],
                    ['id' => 13, 'name' => '貯蓄', 'type' => 'expense', 'color' => '#577590'],
                    ['id' => 14, 'name' => '投資', 'type' => 'expense', 'color' => '#277da1'],
                    ['id' => 15, 'name' => 'その他支出', 'type' => 'expense', 'color' => '#e63946']
                ];

                if ($type === 'expense') {
                    $categories = $expenseCategories;
                } else {
                    $categories = array_merge($categories, $expenseCategories);
                }
            }
        }

        // 結果を返す
        header('Content-Type: application/json');
        echo json_encode(['categories' => $categories]);

    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
}