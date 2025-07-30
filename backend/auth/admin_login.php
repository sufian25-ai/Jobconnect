<?php
include('../session/start.php');
require_once "../config/db.php";
header("Content-Type: application/json");



$response = ["success" => false, "message" => ""];

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($email) || empty($password)) {
    $response["message"] = "Email and Password are required.";
    echo json_encode($response);
    exit;
}

try {
    $sql = "SELECT id, name, email, password, role FROM users WHERE email = :email AND role = 'admin' LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['email' => $email]);

    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (password_verify($password, $user['password'])) {
            $_SESSION['user'] = [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role']
            ];

            $response["success"] = true;
            $response["message"] = "Admin login successful.";
            $response["user"] = $_SESSION['user'];
        } else {
            $response["message"] = "Incorrect password.";
        }
    } else {
        $response["message"] = "No admin found with this email.";
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
}

echo json_encode($response);
