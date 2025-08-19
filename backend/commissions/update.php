<?php
include('../session/start.php');
require_once "../config/db.php";
header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];

// শুধুমাত্র admin role access করতে পারবে
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    $response["message"] = "Unauthorized access.";
    echo json_encode($response);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$status = $data['status'] ?? null;

$valid_statuses = ['pending','paid'];

if (!$id || !$status || !in_array($status, $valid_statuses)) {
    $response["message"] = "Invalid request.";
    echo json_encode($response);
    exit;
}

try {
    $sql = "UPDATE commissions SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$status, $id]);

    $response["success"] = true;
    $response["message"] = "Commission status updated successfully.";

} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

echo json_encode($response);
