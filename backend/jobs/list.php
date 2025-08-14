<?php
require_once __DIR__ . "/../config/db.php";
include('../session/start.php'); // Must be on top, before any output

header("Content-Type: application/json");

$response = ["success" => false, "jobs" => [], "message" => ""];

try {
    $sql = "SELECT id, company_name, company_logo, title, description, location, job_type, salary, deadline, created_at 
            FROM jobs 
            ORDER BY created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $response["success"] = true;
        $response["jobs"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $response["message"] = "No jobs found.";
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

echo json_encode($response);