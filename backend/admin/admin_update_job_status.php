<?php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['job_id']) || !isset($data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$job_id = $data['job_id'];
$status = $data['status'];

try {
    $stmt = $conn->prepare("UPDATE jobs SET status = ? WHERE id = ?");
    $stmt->execute([$status, $job_id]);

    echo json_encode(['success' => true, 'message' => 'Job status updated']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: '.$e->getMessage()]);
}
