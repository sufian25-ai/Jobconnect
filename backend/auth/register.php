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

// Check if email already exists
$checkSql = "SELECT id FROM users WHERE email = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->execute([$email]);
if ($checkStmt->fetch()) {
    echo json_encode(["error" => "Email already registered"]);
    exit;
}

$sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

try {
    $success = $stmt->execute([ $name, $email, $hashed, $role ]);
    if ($success) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Registration failed"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
