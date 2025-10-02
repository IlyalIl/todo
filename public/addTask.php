<?php
require __DIR__ . '/../src/TaskRepository.php';
require __DIR__ . '/../src/helpers.php';

$title = $_POST['title'] ?? null;
$id = $_POST['id'] ?? null;

if ($title !== null && trim($title) !== '') {
    $id = createTask($title);

    header('Content-type: application/json');
    echo json_encode(['success' => true, 'title' => $title, 'id' => $id]);
    exit;
}

header('Content-type: application/json');
echo json_encode(['success' => false, 'error' => 'Title not provided']);
exit;