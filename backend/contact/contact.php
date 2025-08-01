<?php
// Start session and include database configuration
include('../session/start.php');
require_once "../config/db.php";

header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response["message"] = "Invalid request method.";
    echo json_encode($response);
    exit();
}

// Read JSON input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

// Validate JSON
if (empty($data)) {
    $response["message"] = "Invalid data format.";
    echo json_encode($response);
    exit();
}

// Sanitize and assign inputs
$name = trim($data['name'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = preg_replace('/[^0-9+]/', '', $data['phone'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

// Validate required fields
if (!$name || !$email || !$phone || !$subject || !$message) {
    $response["message"] = "All fields are required.";
    echo json_encode($response);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response["message"] = "Please provide a valid email address.";
    echo json_encode($response);
    exit();
}

try {
    // Insert into database
    $stmt = $conn->prepare("
        INSERT INTO contact_submissions 
        (name, email, phone, subject, message, submitted_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$name, $email, $phone, $subject, $message]);

    // Optional: Send email notification to admin
    /*
    $adminEmail = "admin@yourdomain.com";
    $emailSubject = "New Contact Form Submission: $subject";
    $emailBody = "Name: $name\nEmail: $email\nPhone: $phone\nSubject: $subject\nMessage:\n$message";
    mail($adminEmail, $emailSubject, $emailBody);
    */

    $response["success"] = true;
    $response["message"] = "Your message has been submitted successfully.";
} catch (PDOException $e) {
    $response["message"] = "Database error occurred.";
    error_log("Contact Form Error: " . $e->getMessage());
}

// Return response
echo json_encode($response);
$conn = null;
?>
