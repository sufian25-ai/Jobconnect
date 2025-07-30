<?php
include('../session/start.php');
include('../config/db.php');

$data = json_decode(file_get_contents("php://input"));

$name = $data->name ?? '';
$email = $data->email ?? '';
$password = $data->password ?? '';
$role = $data->role ?? 'user';

if (!$name || !$email || !$password) {
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

$hashed = password_hash($password, PASSWORD_BCRYPT);
$sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $name, $email, $hashed, $role);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Email may already be used"]);
}
?>
