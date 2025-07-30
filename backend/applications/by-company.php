<?php
include('../session/start.php');
require_once "../config/db.php";
header("Content-Type: application/json");
$response = ["success" => false, "applications" => [], "message" => ""];

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'company') {
    $response["message"] = "Unauthorized access.";
    echo json_encode($response);
    exit;
}

$company_id = $_SESSION['user_id'];

$sql = "SELECT 
            a.id as application_id,
            a.message,
            a.applied_at,
            j.title as job_title,
            u.name as applicant_name,
            u.email as applicant_email
        FROM job_applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.user_id = u.id
        WHERE j.company_id = ?
        ORDER BY a.applied_at DESC";

$stmt = $conn->prepare($sql);
$stmt->execute([$company_id]);

$applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

$response["success"] = true;
$response["applications"] = $applications;

echo json_encode($response);
