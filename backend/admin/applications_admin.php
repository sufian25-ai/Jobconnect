<?php
// applications_admin.php
header("Content-Type: application/json");
include('../session/start.php');
include('../config/db.php');

// Session check
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['role']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

try {
    $sql = "SELECT 
                a.id, a.job_id, a.user_id, a.name, a.email, a.phone,
                a.resume_path, a.cover_letter, a.status, a.applied_at, a.updated_at,
                j.title as job_title,
                c.name,
                u.name as applicant_name,
                u.email as applicant_email,
                u.profile_img as applicant_image
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            LEFT JOIN companies c ON j.company_id = c.id
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.applied_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format URLs
    foreach ($applications as &$app) {
        $app['resume_url'] = $app['resume_path'] 
            ? 'http://localhost/jobconnect/backend/uploads/resumes/' . $app['resume_path']
            : null;

        $app['applicant_image_url'] = $app['applicant_image'] 
            ? 'http://localhost/jobconnect/backend/uploads/profile_images/' . $app['applicant_image']
            : 'http://localhost/jobconnect/backend/uploads/profile_images/default-user.png';
    }

    echo json_encode(['success' => true, 'applications' => $applications]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
