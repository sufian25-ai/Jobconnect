<?php
include('../session/start.php');
include('../config/db.php');

$company_id = $_GET['company_id'] ?? 0;

$sql = "SELECT * FROM jobs WHERE company_id = ? ORDER BY id DESC";
$stmt = $conn->prepare($sql);
$stmt->execute([$company_id]);
$jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["jobs" => $jobs]);
