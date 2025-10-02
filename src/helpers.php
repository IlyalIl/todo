<?php
function notEmpty(?string $value): bool
{
    return $value !== null && trim($value) !== '';
}

function handleAction(string $action, ?string $id = null, ?string $title = null): array
{
    switch ($action) {
        case 'create':
            if (notEmpty($title)) {
                createTask($title);
                return ['success' => true, 'id' => (int)$id];
            }
            return ['success' => false, 'err' => 'ID is empty'];

        case 'toggle':
            if (notEmpty($id)) {
                toggleTask((int)$id);
                return ['success' => true, 'id' => (int)$id];
            }
            return ['success' => false, 'err' => 'ID is empty'];

        case 'delete':
            if (notEmpty($id)) {
                deleteTask((int)$id);
                return ['success' => true, 'id' => (int)$id];
            }
            return ['success' => false, 'err' => 'ID is empty'];

        default:
            return ['success' => false, 'error' => 'Unknown action'];
    }
}
