<?php
// Check if email and password are sent via POST
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Simulate basic validation (use a real database in production)
if ($email == 'mac22@gmail.com' && $password == 'mac22') {
    echo json_encode(['status' => 'success', 'message' => 'Login successful']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
}
?>
