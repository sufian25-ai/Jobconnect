<?php
include('../session/start.php');
include('../config/db.php');

header('Content-Type: application/json');

// সেশন চেক
if (!isset($_SESSION['user']['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);
    exit;
}

$user_id = $_SESSION['user']['id'];

// ইউজারের ডেটা আনা
$sql = "SELECT id, name, email, phone, address, skills, experience, education, bio, linkedin, github, website, resume, profile_img 
        FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$user_id]);

if ($stmt->rowCount() > 0) {
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode([
        "success" => true,
        "profile" => $profile
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Profile not found"
    ]);
}
?>
