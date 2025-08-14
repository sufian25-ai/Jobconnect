<?php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php'); // $conn is PDO

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authorized']);
    exit;
}

$user_id = $_SESSION['user']['id'];

try {
    $stmt = $conn->prepare("SELECT id, name, email, phone, logo 
                            FROM companies 
                            WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($company) {
        echo json_encode([
            'success' => true,
            'company' => $company
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Company profile not found'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
