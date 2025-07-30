<?php
require_once "../config/db.php";

$response = ["success" => false, "message" => ""];

$name = "Admin";
$email = "admin@gmail.com";
$password = "admin123"; // Change this to a strong password
$role = "admin";

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if admin already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = :email AND role = :role");
$stmt->execute([
    ":email" => $email,
    ":role" => $role
]);

if ($stmt->rowCount() > 0) {
    $response["message"] = "Admin already exists.";
} else {
    // Insert admin user
    $sql = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
    $stmt = $conn->prepare($sql);
    $inserted = $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":password" => $hashed_password,
        ":role" => $role
    ]);

    if ($inserted) {
        $response["success"] = true;
        $response["message"] = "Admin created successfully.";
    } else {
        $response["message"] = "Failed to create admin.";
    }
}

header("Content-Type: application/json");
echo json_encode($response);
