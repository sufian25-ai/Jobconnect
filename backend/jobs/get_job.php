<?php
include('../session/start.php');
include('../config/db.php');

$id = $_GET['id'] ?? 0;

$stmt = $conn->prepare("SELECT * FROM jobs WHERE id = ?");
$stmt->execute([$id]);
$job = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(["job" => $job]);
