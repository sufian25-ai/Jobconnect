<?php
include('../session/start.php');
require_once "../config/db.php";
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "data" => []];

// শুধুমাত্র admin role access করতে পারবে
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    $response["message"] = "Unauthorized access.";
    echo json_encode($response);
    exit;
}

try {
    $sql = "SELECT c.id, c.company_id, co.name AS company_name, 
                   c.user_id, u.name AS user_name, 
                   c.job_id, j.title AS job_title, 
                   c.total_salary, c.admin_commission, 
                   c.status, c.created_at
            FROM commissions c
            JOIN companies co ON c.company_id = co.id
            JOIN users u ON c.user_id = u.id
            JOIN jobs j ON c.job_id = j.id
            ORDER BY c.created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $commissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response["success"] = true;
    $response["data"] = $commissions;

} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

echo json_encode($response);
