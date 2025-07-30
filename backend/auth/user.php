<?php
include('../session/start.php');

if (isset($_SESSION['user'])) {
    echo json_encode(["user" => $_SESSION['user']]);
} else {
    echo json_encode(["user" => null]);
}
?>
