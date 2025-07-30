<?php
session_start();
require_once '../config/db.php';
include('../session/start.php');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit;
}

$userId = $_SESSION['user_id'];

if (isset($_FILES['resume'])) {
    $file = $_FILES['resume'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    
    if ($ext !== 'pdf') {
        http_response_code(400);
        echo json_encode(["message" => "Only PDF files allowed"]);
        exit;
    }

    $filename = uniqid() . ".pdf";
    move_uploaded_file($file['tmp_name'], "../../uploads/resumes/" . $filename);

    $stmt = $conn->prepare("UPDATE users SET resume=? WHERE id=?");
    $stmt->bind_param("si", $filename, $userId);
    $stmt->execute();

    echo json_encode(["message" => "Resume uploaded"]);
}
?>
