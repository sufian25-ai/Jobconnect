<?php
include('../session/start.php');
require_once "../config/db.php";
header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'user') {
    $response["message"] = "Unauthorized.";
    echo json_encode($response);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$job_id = $data["job_id"] ?? null;
$message = $data["message"] ?? "";

if (!$job_id) {
    $response["message"] = "Job ID is required.";
    echo json_encode($response);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO job_applications (job_id, user_id, message, applied_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$job_id, $_SESSION['user_id'], $message]);

    $response["success"] = true;
    $response["message"] = "Application submitted successfully.";
} catch (PDOException $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
