<?php
include('../session/start.php');
require_once('../config/db.php');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit;
}

$id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT name, email, skills, experience, resume, profile_img FROM users WHERE id=?");

$stmt->execute([$id]);
$result = $stmt->fetch();

echo json_encode($result->fetch_assoc());
?>
