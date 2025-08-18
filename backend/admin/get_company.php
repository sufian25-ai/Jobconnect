<?php
// get_company.php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php');

// Check if admin is logged in
if (!isset($_SESSION['user']['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Not authorized'
    ]);
    exit;
}

$user_id = $_SESSION['user']['id'];

try {
    $stmt = $conn->prepare("SELECT * FROM companies WHERE user_id = 1");
    $stmt->execute([$user_id]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$company) {
        echo json_encode([
            'success' => false,
            'message' => 'Company not found'
        ]);
        exit;
    }

    // Add full URL for logo and banner
    $company['logo'] = $company['logo'] 
        ? 'http://localhost/jobconnect/backend/uploads/company_logos/' . $company['logo'] 
        : null;
    $company['banner'] = $company['banner'] 
        ? 'http://localhost/jobconnect/backend/uploads/company_banners/' . $company['banner'] 
        : null;

    echo json_encode([
        'success' => true,
        'company' => $company
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
