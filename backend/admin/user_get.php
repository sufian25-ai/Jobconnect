<?php
include('../session/start.php');
require_once __DIR__ . "/../config/db.php";

header("Content-Type: application/json");
$response = ["success" => false, "users" => [], "message" => ""];

try {
    // সেশন চেক
    if (!isset($_SESSION['user'])) {
        throw new Exception("Session expired or not logged in", 401);
    }

    // অ্যাডমিন চেক
    if ($_SESSION['user']['role'] !== 'admin') {
        throw new Exception("Admin privileges required", 403);
    }

    // ডাটাবেস থেকে ইউজার ফেচ
    $stmt = $conn->prepare("SELECT id, name, email, role FROM users ORDER BY id DESC");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response["success"] = true;
    $response["users"] = $users ?: [];

} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
    http_response_code(500);
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
}

echo json_encode($response);
