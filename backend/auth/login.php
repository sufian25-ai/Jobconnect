<?php
header("Content-Type: application/json");
include('../session/start.php');
include('../config/db.php');

// ইনপুট নেওয়া
$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$password = $data->password ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email and Password required"]);
    exit;
}

try {
    // Users টেবিল থেকে ইউজার খোঁজা
    $sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {

        // Default user data
        $_SESSION['user'] = [
            "id"    => $user['id'],
            "name"  => $user['name'],
            "email" => $user['email'],
            "role"  => $user['role'],
        ];

        // যদি role = company হয়, তাহলে company_id ও নিয়ে আসব
        if ($user['role'] === "company") {
            $sqlCompany = "SELECT id FROM companies WHERE user_id = ? LIMIT 1";
            $stmtCompany = $conn->prepare($sqlCompany);
            $stmtCompany->execute([$user['id']]);
            $company = $stmtCompany->fetch(PDO::FETCH_ASSOC);

            if ($company) {
                $_SESSION['user']['company_id'] = $company['id'];
            } else {
                $_SESSION['user']['company_id'] = null; // কোম্পানি টেবিলে না থাকলে null
            }
        }

        echo json_encode(["success" => true, "user" => $_SESSION['user']]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
