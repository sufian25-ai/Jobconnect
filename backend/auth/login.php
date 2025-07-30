<?php
include('../session/start.php');
include('../config/db.php');

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$password = $data->password ?? '';

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user'] = [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role']
    ];
    echo json_encode(["success" => true, "user" => $_SESSION['user']]);
} else {
    echo json_encode(["error" => "Invalid email or password"]);
}
?>
