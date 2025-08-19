<?php
// companies_admin.php
header("Content-Type: application/json");
include('../session/start.php');
include('../config/db.php');

// Check if admin
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['role']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

try {
    $sql = "SELECT * FROM companies ORDER BY created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $companies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format logo and banner URLs
    foreach ($companies as &$company) {
        $company['logo_url'] = $company['logo'] 
            ? 'http://localhost/jobconnect/backend/uploads/company_logos/' . $company['logo'] 
            : 'http://localhost/jobconnect/backend/uploads/company_logos/default.png';

        $company['banner_url'] = $company['banner'] 
            ? 'http://localhost/jobconnect/backend/uploads/company_banners/' . $company['banner'] 
            : null;
    }

    echo json_encode(['success' => true, 'companies' => $companies]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
