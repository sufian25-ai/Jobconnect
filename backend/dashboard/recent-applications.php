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
        SELECT a.id, u.name, j.title AS job, c.name AS company, a.status, a.applied_at AS date
        FROM applications a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN jobs j ON a.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        ORDER BY a.applied_at DESC
        LIMIT 5
    ");
    $stmt->execute();
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'applications' => $applications]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: '.$e->getMessage()]);
}
