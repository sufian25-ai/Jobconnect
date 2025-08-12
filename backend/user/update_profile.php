<?php
include('../session/start.php');
include('../config/db.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user']['id'];

// ইনপুট ডেটা নেওয়া
$data = json_decode(file_get_contents("php://input"), true);

$sql = "UPDATE users SET 
        name = ?, 
        email = ?, 
        phone = ?, 
        address = ?, 
        skills = ?, 
        experience = ?, 
        education = ?, 
        bio = ?, 
        linkedin = ?, 
        github = ?, 
        website = ? 
        WHERE id = ?";
$stmt = $conn->prepare($sql);

$updated = $stmt->execute([
    $data['name'],
    $data['email'],
    $data['phone'],
    $data['address'],
    $data['skills'],
    $data['experience'],
    $data['education'],
    $data['bio'],
    $data['linkedin'],
    $data['github'],
    $data['website'],
    $user_id
]);

if ($updated) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update profile"]);
}
?>
