<?php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $stats = [];

    // Users
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM users");
    $stmt->execute();
    $stats['users'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Companies
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM companies");
    $stmt->execute();
    $stats['companies'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Jobs
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM jobs");
    $stmt->execute();
    $stats['jobs'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Applications
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM applications");
    $stmt->execute();
    $stats['applications'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Commissions
    $stmt = $conn->prepare("SELECT SUM(admin_commission) AS total FROM commissions");
    $stmt->execute();
    $stats['commissions'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    // Pending Jobs
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM jobs WHERE status='pending'");
    $stmt->execute();
    $stats['pendingJobs'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // // Messages (unread)
    // $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM messages WHERE status='unread'");
    // $stmt->execute();
    // $stats['messages'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode(['success' => true, 'stats' => $stats]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: '.$e->getMessage()]);
}
