<?php
include('../session/start.php');
include('../config/db.php');

$company_id = $_GET['company_id'] ?? 0;

$sql = "SELECT * FROM jobs WHERE company_id = ? ORDER BY id DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $company_id);
$stmt->execute();
$result = $stmt->get_result();

$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode(["jobs" => $jobs]);
