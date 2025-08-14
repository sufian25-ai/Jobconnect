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

    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        throw new Exception("Invalid user ID", 400);
    }

    $userId = (int)$_GET['id'];

    // নিজেকে ডিলিট করা যাবে না
    if ($userId === (int)$_SESSION['user']['id']) {
        throw new Exception("You cannot delete your own account", 400);
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        $response["success"] = true;
        $response["message"] = "User deleted successfully";
    } else {
        $response["message"] = "User not found or could not be deleted";
    }

} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
    http_response_code(500);
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
}

echo json_encode($response);
