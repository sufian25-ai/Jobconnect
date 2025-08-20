<?php
// apply.php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php');

// Check if user is logged in
if (!isset($_SESSION['user']['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'You must be logged in to apply'
    ]);
    exit;
}

$user_id = $_SESSION['user']['id'];

// Validate required fields
$job_id = $_POST['job_id'] ?? null;
$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$phone = $_POST['phone'] ?? null;
$cover_letter = $_POST['cover_letter'] ?? null;

if (!$job_id || !$name || !$email || !$phone) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit;
}

// Handle resume upload
$resume_path = '';
if (isset($_FILES['resume']) && $_FILES['resume']['error'] === 0) {
    $allowed_ext = ['pdf', 'doc', 'docx'];
    $file_name = $_FILES['resume']['name'];
    $file_tmp = $_FILES['resume']['tmp_name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $max_size = 2 * 1024 * 1024; // 2MB

    if (!in_array($file_ext, $allowed_ext)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only PDF/DOC allowed.']);
        exit;
    }

    if ($_FILES['resume']['size'] > $max_size) {
        echo json_encode(['success' => false, 'message' => 'File too large. Max 2MB allowed.']);
        exit;
    }

    $new_file_name = 'resume_' . time() . '_' . rand(1000, 9999) . '.' . $file_ext;
    $upload_dir = '../uploads/resumes/';

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $resume_path_full = $upload_dir . $new_file_name;

    if (!move_uploaded_file($file_tmp, $resume_path_full)) {
        echo json_encode(['success' => false, 'message' => 'Failed to upload resume']);
        exit;
    }

    // Save relative path for DB
    $resume_path =  $new_file_name;
}

// Insert into database
try {
    $stmt = $conn->prepare("INSERT INTO applications (job_id, user_id, name, email, phone, resume_path, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$job_id, $user_id, $name, $email, $phone, $resume_path, $cover_letter]);

    echo json_encode(['success' => true, 'message' => 'Application submitted successfully!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
