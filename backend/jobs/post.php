<?php
header('Content-Type: application/json');
include('../session/start.php');
include('../config/db.php'); // ধরে নিচ্ছি এখানে $conn হলো PDO অবজেক্ট

// ইনপুট নেওয়া
$input = json_decode(file_get_contents("php://input"), true);

// ট্রিম করে নেওয়া
$title       = trim($input['title'] ?? '');
$desc        = trim($input['description'] ?? '');
$location    = trim($input['location'] ?? '');
$type        = trim($input['job_type'] ?? 'Full-time');
$salary      = isset($input['salary']) && $input['salary'] !== '' ? $input['salary'] : null;
$deadline    = trim($input['deadline'] ?? '') ?: null;
$company_id  = isset($input['company_id']) ? intval($input['company_id']) : 0;
$company_name = trim($input['company_name'] ?? '');
$company_logo = trim($input['company_logo'] ?? '');

// validation
$errors = [];
if (!$company_id) $errors[] = "company_id is required and must be a positive integer.";
if ($company_name === '') $errors[] = "company_name is required.";
if ($title === '') $errors[] = "title is required.";
if ($desc === '') $errors[] = "description is required.";
if ($location === '') $errors[] = "location is required.";

// deadline ফরম্যাট চেক (যদি দেওয়া থাকে)
if ($deadline !== null) {
    $d = DateTime::createFromFormat('Y-m-d', $deadline);
    if (!$d || $d->format('Y-m-d') !== $deadline) {
        $errors[] = "Invalid deadline format. Use YYYY-MM-DD.";
    }
}

if (!empty($errors)) {
    echo json_encode([
        "success" => false,
        "error" => "Validation failed",
        "details" => $errors
    ]);
    exit;
}

try {
    $sql = "INSERT INTO jobs (company_id, company_name, company_logo, title, description, location, job_type, salary, deadline, status)
            VALUES (:company_id, :company_name, :company_logo, :title, :description, :location, :job_type, :salary, :deadline, 'pending')";

    $stmt = $conn->prepare($sql);

    // bind values
    $stmt->bindValue(':company_id', $company_id, PDO::PARAM_INT);
    $stmt->bindValue(':company_name', $company_name, PDO::PARAM_STR);
    $stmt->bindValue(':company_logo', $company_logo, PDO::PARAM_STR);
    $stmt->bindValue(':title', $title, PDO::PARAM_STR);
    $stmt->bindValue(':description', $desc, PDO::PARAM_STR);
    $stmt->bindValue(':location', $location, PDO::PARAM_STR);
    $stmt->bindValue(':job_type', $type, PDO::PARAM_STR);

    if ($salary !== null && is_numeric($salary)) {
        $stmt->bindValue(':salary', floatval($salary));
    } else {
        $stmt->bindValue(':salary', null, PDO::PARAM_NULL);
    }

    if ($deadline !== null) {
        $stmt->bindValue(':deadline', $deadline, PDO::PARAM_STR);
    } else {
        $stmt->bindValue(':deadline', null, PDO::PARAM_NULL);
    }

    $exec = $stmt->execute();

    if ($exec) {
        echo json_encode([
            "success" => true,
            "insert_id" => $conn->lastInsertId()
        ]);
    } else {
        $info = $stmt->errorInfo();
        echo json_encode([
            "success" => false,
            "error" => "Insert failed",
            "details" => $info[2] ?? 'Unknown error'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Database error",
        "details" => $e->getMessage()
    ]);
}
