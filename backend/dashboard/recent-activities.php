<?php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    // Recent jobs
    $stmt = $conn->prepare("
        SELECT j.id, j.title, c.name AS company, j.created_at
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        ORDER BY j.created_at DESC
        LIMIT 5
    ");
    $stmt->execute();
    $recentJobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'recent_jobs' => $recentJobs
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: '.$e->getMessage()]);
}
