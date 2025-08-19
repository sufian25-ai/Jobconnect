<?php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT j.id, j.company_id, j.title, j.description, j.location, j.job_type, 
               j.salary, j.deadline, j.status, j.created_at, j.updated_at,
               c.name, c.logo
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        ORDER BY j.created_at DESC
    ");
    $stmt->execute();
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'jobs' => $jobs]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: '.$e->getMessage()]);
}
