<?php
header("Content-Type: application/json");
include('../session/start.php');
include('../config/db.php');

// JSON ডাটা নেওয়া
$data = json_decode(file_get_contents("php://input"));

$job_id = $data->id ?? 0;
$user_id = $_SESSION['user']['id'] ?? 0;
$company_id = $_SESSION['user']['company_id'] ?? 0;

if (!$job_id || !$company_id) {
    echo json_encode(["success" => false, "message" => "Unauthorized request"]);
    exit;
}

try {
    // প্রথমে চেক করব Job ওই কোম্পানির কিনা
    $sql = "SELECT id FROM jobs WHERE id = ? AND company_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$job_id, $company_id]);
    $job = $stmt->fetch();

    if ($job) {
        $sqlDelete = "DELETE FROM jobs WHERE id = ? AND company_id = ?";
        $stmtDel = $conn->prepare($sqlDelete);
        $stmtDel->execute([$job_id, $company_id]);

        echo json_encode(["success" => true, "message" => "Job deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Job not found or unauthorized"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
