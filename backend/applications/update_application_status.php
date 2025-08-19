<?php
include('../session/start.php');
require_once "../config/db.php";
header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];

// শুধুমাত্র company role update করতে পারবে
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'company') {
    $response["message"] = "Unauthorized access.";
    echo json_encode($response);
    exit;
}

// Input Data (React থেকে আসবে JSON এ)
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$status = $data['status'] ?? null;

$valid_statuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

if (!$id || !$status || !in_array($status, $valid_statuses)) {
    $response["message"] = "Invalid request.";
    echo json_encode($response);
    exit;
}

try {
    // প্রথমে check করব application টা কোম্পানির job এর কিনা
    $company_id = $_SESSION['user']['company_id'];

    $checkSql = "SELECT a.id 
                 FROM applications a
                 JOIN jobs j ON a.job_id = j.id
                 WHERE a.id = ? AND j.company_id = ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->execute([$id, $company_id]);
    $app = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if (!$app) {
        $response["message"] = "Application not found or not authorized.";
        echo json_encode($response);
        exit;
    }

    // এখন update করব
    $sql = "UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$status, $id]);

    $response["success"] = true;
    $response["message"] = "Application status updated successfully.";

} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

echo json_encode($response);
