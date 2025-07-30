<?php
include('../session/start.php');
include('../config/db.php');

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$desc = $data['description'] ?? '';
$location = $data['location'] ?? '';
$type = $data['job_type'] ?? 'Full-time';
$salary = $data['salary'] ?? null;
$deadline = $data['deadline'] ?? null;
$company_id = $data['company_id'] ?? 0;

if ($title && $desc && $location && $company_id) {
    $sql = "INSERT INTO jobs (company_id, title, description, location, job_type, salary, deadline) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issssds", $company_id, $title, $desc, $location, $type, $salary, $deadline);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Insert failed"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
}
