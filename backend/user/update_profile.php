<?php
session_start();
require_once '../config/db.php';
include('../session/start.php');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $_SESSION['user_id'];

$stmt = $conn->prepare("UPDATE users SET name=?, email=?, skills=?, experience=? WHERE id=?");
$sucess->execute([$data['name'], $data['email'], $data['skills'], $data['experience'], $id]);

if ($sucess) {
    echo json_encode(["message" => "Profile updated successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error updating profile."]);
}
?>
