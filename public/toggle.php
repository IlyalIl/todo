<?php
require __DIR__ . '/../src/TaskRepository.php';

header('Content-Type: application/json');

$id = isset($_POST['id']) ? (int) $_POST['id'] : null;

if ($id !== null) {
    toggleTask($id);
    echo json_encode(['success' => true, 'id' => $id]);
} else {
    echo json_encode(['success' => false, 'error' => 'id not provided']);
}