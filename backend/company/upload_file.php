<?php
header('Content-Type: application/json');
include('../config/db.php');
include('../session/start.php');

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authorized']);
    exit;
}

if (!isset($_FILES['file']) || !isset($_POST['type'])) {
    echo json_encode(['success' => false, 'message' => 'No file or type specified']);
    exit;
}

$user_id = $_SESSION['user']['id'];
$file = $_FILES['file'];
$type = $_POST['type'];

// Validate file type
$allowedTypes = [
    'logo' => ['image/jpeg', 'image/png'],
    'banner' => ['image/jpeg', 'image/png']
];

if (!array_key_exists($type, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type']);
    exit;
}

if (!in_array($file['type'], $allowedTypes[$type])) {
    echo json_encode(['success' => false, 'message' => 'Invalid file format']);
    exit;
}

// Validate file size
$maxSizes = [
    'logo' => 2 * 1024 * 1024, // 2MB
    'banner' => 5 * 1024 * 1024 // 5MB
];

if ($file['size'] > $maxSizes[$type]) {
    echo json_encode(['success' => false, 'message' => 'File too large']);
    exit;
}

// Create upload directories if they don't exist
$uploadDirs = [
    'logo' => '../uploads/company_logos',
    'banner' => '../uploads/company_banners'
];

if (!is_dir($uploadDirs[$type])) {
    mkdir($uploadDirs[$type], 0755, true);
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9\.]/', '_', $file['name']);
$targetPath = $uploadDirs[$type] . '/' . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    try {
        // Get company ID
        $stmt = $conn->prepare("SELECT id FROM companies WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $company = $stmt->fetch();

        if (!$company) {
            // Create company record if it doesn't exist
            $stmt = $conn->prepare("INSERT INTO companies (user_id) VALUES (?)");
            $stmt->execute([$user_id]);
            $company_id = $conn->lastInsertId();
        } else {
            $company_id = $company['id'];
        }

        // Update company record with new filename
        $sql = "UPDATE companies SET $type = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$filename, $company_id]);

        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'message' => 'File uploaded successfully'
        ]);

    } catch(PDOException $e) {
        unlink($targetPath); // Delete the uploaded file if DB update fails
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'File upload failed']);
}
?>