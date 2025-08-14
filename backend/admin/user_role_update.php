<?php
include('../session/start.php');
require_once __DIR__ . "/../config/db.php";

header("Content-Type: application/json");
$response = ["success" => false, "message" => ""];

try {
    if (!isset($_SESSION['user'])) {
        throw new Exception("Session expired or not logged in", 401);
    }

    if ($_SESSION['user']['role'] !== 'admin') {
        throw new Exception("Admin privileges required", 403);
    }

    // JSON ডেটা রিসিভ
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) || !isset($data['role'])) {
        throw new Exception("Invalid data provided", 400);
    }

    $userId = (int)$data['id'];
    $newRole = trim($data['role']);

    // অনুমোদিত রোল
    $validRoles = ['user', 'company', 'admin'];
    if (!in_array($newRole, $validRoles)) {
        throw new Exception("Invalid role", 400);
    }

    // নিজেকে রোল পরিবর্তন করা যাবে না
    if ($userId === (int)$_SESSION['user']['id']) {
        throw new Exception("You cannot change your own role", 400);
    }

    $stmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
    $stmt->execute([$newRole, $userId]);

    if ($stmt->rowCount() > 0) {
        $response["success"] = true;
        $response["message"] = "User role updated successfully";
    } else {
        $response["message"] = "User not found or role unchanged";
    }

} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
    http_response_code(500);
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
}

echo json_encode($response);
