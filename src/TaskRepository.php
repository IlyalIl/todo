<?php
require __DIR__ . "/../src/db.php";

function getAllTasks(): array
{
    $pdo = getPDO();

    $queryAll = $pdo->query("SELECT * FROM tasks");
    $tasks = $queryAll->fetchAll();

    return $tasks;
}


function createTask($title): int
{
    $pdo = getPDO();

    $queryCreate = $pdo->prepare("INSERT INTO tasks (title) VALUE (:title)");
    $queryCreate->execute([':title' => $title]);
    return (int)$pdo->lastInsertId();
}

function toggleTask(int $taskId): void
{
    $pdo = getPDO();

    $queryToggle = $pdo->prepare("UPDATE tasks SET status = 1 - status WHERE id = :taskId");
    $queryToggle->execute([':taskId' => $taskId]);
}

function deleteTask(int $taskId): void
{
    $pdo = getPDO();

    $queryDelete = $pdo->prepare("DELETE FROM tasks WHERE id = :taskId");
    $queryDelete->execute([':taskId' => $taskId]);

}