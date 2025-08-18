<?php
include('../session/start.php');
include('../config/db.php');

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? 0;
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$location = $data['location'] ?? '';
$job_type = $data['job_type'] ?? '';
$salary = $data['salary'] ?? null;
$deadline = $data['deadline'] ?? null;
$status = $data['status'] ?? 'pending';

$stmt = $conn->prepare("
    UPDATE jobs SET
        title=?, description=?, location=?, job_type=?, salary=?, deadline=?, status=?, updated_at=NOW()
    WHERE id=?
");
$success = $stmt->execute([$title, $description, $location, $job_type, $salary, $deadline, $status, $id]);

echo json_encode(["success" => $success]);
