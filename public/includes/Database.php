<?php
class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        $config = require __DIR__ . '/../../config/database.php';

        try {
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
            $this->connection = new PDO($dsn, $config['username'], $config['password'], $config['options']);
        } catch (PDOException $e) {
            // エラーページにリダイレクト
            $this->redirectToErrorPage();
        }
    }

    // シングルトンパターン - 常に同じインスタンスを返す
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // データベース接続を取得
    public function getConnection() {
        return $this->connection;
    }

    // データベースクエリの実行
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            throw $e;
        }
    }

    // 単一行の取得
    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }

    // 複数行の取得
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    // レコードの挿入
    public function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_map(function($key) {
            return ":{$key}";
        }, array_keys($data)));

        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        $this->query($sql, $data);

        return $this->connection->lastInsertId();
    }

    // 一括挿入
    public function insertBatch($table, $dataArray) {
        if (empty($dataArray)) {
            return 0;
        }

        $this->connection->beginTransaction();
        $count = 0;

        try {
            foreach ($dataArray as $data) {
                $columns = implode(', ', array_keys($data));
                $placeholders = implode(', ', array_map(function($key) {
                    return ":{$key}";
                }, array_keys($data)));

                $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
                $this->query($sql, $data);
                $count++;
            }
            $this->connection->commit();
            return $count;
        } catch (Exception $e) {
            $this->connection->rollBack();
            throw $e;
        }
    }

    // レコードの更新
    public function update($table, $data, $where, $whereParams = []) {
        $set = implode(', ', array_map(function($key) {
            return "{$key} = :{$key}";
        }, array_keys($data)));

        $sql = "UPDATE $table SET $set WHERE $where";
        $params = array_merge($data, $whereParams);

        return $this->query($sql, $params)->rowCount();
    }

    // レコードの削除
    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        return $this->query($sql, $params)->rowCount();
    }

    // トランザクション開始
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }

    // コミット
    public function commit() {
        return $this->connection->commit();
    }

    // ロールバック
    public function rollBack() {
        return $this->connection->rollBack();
    }

    // エラーページにリダイレクト
    private function redirectToErrorPage() {
        // 現在のURLからベースURLを取得
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');

        // APIリクエストの場合はJSONレスポンスを返す
        if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Database connection error']);
            exit;
        }

        // それ以外の場合はエラーページにリダイレクト
        header("Location: $baseUrl$basePath/error.php");
        exit;
    }
}