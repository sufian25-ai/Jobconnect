<?php
include('../session/start.php');
require_once "../config/db.php";
header("Content-Type: application/json");

$response = ["success" => false, "applications" => [], "message" => ""];

// ✅ সঠিকভাবে সেশন চেক করা
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'company') {
    $response["message"] = "Unauthorized access.";
    echo json_encode($response);
    exit;
}

// ✅ company_id সেশন থেকে নেওয়া
$company_id = $_SESSION['user']['company_id'] ?? null;

if (!$company_id) {
    $response["message"] = "Company not found for this user.";
    echo json_encode($response);
    exit;
}

$sql = "SELECT 
            a.id,
            a.job_id,
            a.user_id,
            a.name,
            a.email,
            a.phone,
            a.resume_path,
            a.cover_letter,
            a.status,
            a.applied_at,
            a.updated_at,
            j.title as job_title,
            u.name as applicant_name,
            u.email as applicant_email,
            u.profile_img as applicant_image
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        LEFT JOIN users u ON a.user_id = u.id
        WHERE j.company_id = ?
        ORDER BY a.applied_at DESC";

try {
    $stmt = $conn->prepare($sql);
    $stmt->execute([$company_id]);
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data with full URLs
    foreach ($applications as &$app) {
        $app['resume_url'] = 'http://localhost/jobconnect/backend/uploads/resumes/' . $app['resume_path'];
        $app['applicant_image_url'] = $app['applicant_image'] 
            ? 'http://localhost/Jobconnect/backend/uploads/profile_images/' . $app['applicant_image']
            : '/images/default-user.png';
    }
    
    $response["success"] = true;
    $response["applications"] = $applications;
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

echo json_encode($response);
?>
