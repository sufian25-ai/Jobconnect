<?php
header("Content-Type: application/json");
include('../session/start.php');
include('../config/db.php');

// শুধু admin এক্সেস
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

try {
    // Summary cards
    $summary = [
        "today" => 0,
        "month" => 0,
        "year" => 0,
        "total" => 0,
        "paid" => 0,
        "pending" => 0
    ];

    // আজকের income
    $stmt = $conn->query("SELECT SUM(admin_commission) as total FROM commissions WHERE DATE(created_at) = CURDATE()");
    $summary["today"] = $stmt->fetchColumn() ?: 0;

    // এই মাসের income
    $stmt = $conn->query("SELECT SUM(admin_commission) as total FROM commissions WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())");
    $summary["month"] = $stmt->fetchColumn() ?: 0;

    // এই বছরের income
    $stmt = $conn->query("SELECT SUM(admin_commission) as total FROM commissions WHERE YEAR(created_at) = YEAR(CURDATE())");
    $summary["year"] = $stmt->fetchColumn() ?: 0;

    // মোট income
    $stmt = $conn->query("SELECT SUM(admin_commission) as total FROM commissions");
    $summary["total"] = $stmt->fetchColumn() ?: 0;

    // Paid income
    $stmt = $conn->query("SELECT SUM(admin_commission) as total FROM commissions WHERE status='paid'");
    $summary["paid"] = $stmt->fetchColumn() ?: 0;

    // Pending income
    $stmt = $conn->query("SELECT SUM(admin_commission) as total FROM commissions WHERE status='pending'");
    $summary["pending"] = $stmt->fetchColumn() ?: 0;

    // মাসওয়ারি ডাটা (চার্টের জন্য)
    $stmt = $conn->query("SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(admin_commission) as total 
                          FROM commissions 
                          GROUP BY month 
                          ORDER BY month ASC");
    $monthly = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "summary" => $summary, "monthly" => $monthly]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
