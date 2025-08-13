<?php
header('Content-Type: application/json');
include('../config/db.php');
include('../session/start.php');

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authorized']);
    exit;
}

$user_id = $_SESSION['user']['id'];
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

try {
    // Check if company exists
    $stmt = $conn->prepare("SELECT id FROM companies WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $company = $stmt->fetch();

    if ($company) {
        // Update existing company
        $sql = "UPDATE companies SET 
                name = ?, email = ?, phone = ?, address = ?, industry = ?, 
                founded = ?, description = ?, website = ?, linkedin = ?, 
                employees = ?, products = ?, services = ?, achievements = ?
                WHERE user_id = ?";
        
        $stmt = $conn->prepare($sql);
        $success = $stmt->execute([
            $data['name'], $data['email'], $data['phone'], $data['address'],
            $data['industry'], $data['founded'], $data['description'],
            $data['website'], $data['linkedin'], $data['employees'],
            $data['products'], $data['services'], $data['achievements'],
            $user_id
        ]);
    } else {
        // Create new company
        $sql = "INSERT INTO companies (
                user_id, name, email, phone, address, industry, 
                founded, description, website, linkedin, 
                employees, products, services, achievements
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $success = $stmt->execute([
            $user_id, $data['name'], $data['email'], $data['phone'], 
            $data['address'], $data['industry'], $data['founded'], 
            $data['description'], $data['website'], $data['linkedin'],
            $data['employees'], $data['products'], $data['services'], 
            $data['achievements']
        ]);
    }

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>