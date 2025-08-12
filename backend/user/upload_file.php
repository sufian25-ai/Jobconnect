<?php
include('../session/start.php');
include('../config/db.php');

header('Content-Type: application/json');

// Debugging - log all incoming data
error_log('Upload request received. POST: ' . print_r($_POST, true));
error_log('FILES: ' . print_r($_FILES, true));

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user']['id'];
$type = $_POST['type'] ?? '';

// More comprehensive file check
if (!isset($_FILES['file']) || $_FILES['file']['error'] == UPLOAD_ERR_NO_FILE) {
    echo json_encode(["success" => false, "message" => "No file uploaded or empty file"]);
    exit;
}

$file = $_FILES['file'];

// Check for all possible upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    $upload_errors = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE in form',
        UPLOAD_ERR_PARTIAL => 'File only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
    ];
    $error_message = $upload_errors[$file['error']] ?? 'Unknown upload error';
    echo json_encode(["success" => false, "message" => $error_message]);
    exit;
}

// Validate file type and size
$max_size = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $max_size) {
    echo json_encode(["success" => false, "message" => "File too large (max 5MB)"]);
    exit;
}

$filename = time() . "_" . basename($file['name']);
$filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename); // Sanitize filename

if ($type === "resume") {
    $targetDir = "../uploads/resumes/";
    $allowed_types = ['pdf', 'doc', 'docx'];
} else {
    $type = "profile_img";
    $targetDir = "../uploads/profile_images/";
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
}

// Check file extension
$file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
if (!in_array($file_ext, $allowed_types)) {
    echo json_encode(["success" => false, "message" => "Invalid file type"]);
    exit;
}

// Create directory if not exists
if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) {
        echo json_encode(["success" => false, "message" => "Failed to create upload directory"]);
        exit;
    }
}

$targetPath = $targetDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $sql = "UPDATE users SET $type = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$filename, $user_id]);

    echo json_encode(["success" => true, "filename" => $filename]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to move uploaded file"]);
    error_log("Failed to move uploaded file. Check permissions for: " . $targetPath);
}
?>