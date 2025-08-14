<?php
header('Content-Type: application/json');
include('../config/db.php');
include('../session/start.php');

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authorized']);
    exit;
}

$user_id = $_SESSION['user']['id'];

try {
    // Get company profile
    $stmt = $conn->prepare("SELECT * FROM companies WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$company) {
        echo json_encode(['success' => false, 'message' => 'Company profile not found']);
        exit;
    }

    // Get job openings (status 'approved' matches your enum)
    $stmt = $conn->prepare("SELECT id, title, location, job_type, status 
                            FROM jobs 
                            WHERE company_id = ? AND status = 'approved'");
    $stmt->execute([$company['id']]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'company' => $company,
        'job_openings' => $jobs
    ]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
