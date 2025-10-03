<?php
require __DIR__ . '/../src/TaskRepository.php';
require __DIR__ . '/../src/helpers.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : null;
    $action = $_POST['action'] ?? null;
    $title = isset($_POST['title']) ? (trim($_POST['title'])) : null;

    if ($action !== null) {
        $result = handleAction($action, $id, $title);

        header('Content-Type: application/json');
        echo json_encode($result);
        exit;
    }

    header('Location: /public/');
    exit;
}

$tasks = getAllTasks();
?>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ToDo</title>
    <link rel="stylesheet" href="/public/reset.css">
    <link rel="stylesheet" href="/public/styles.css">
    <script src="/public/main.js" defer></script>
</head>
<body>
<header class="page-header">
    <h1 class="page-header__title">
        СПИСОК ДЕЛ
    </h1>
    <nav class="page-header__nav" id="filters">
        <button class="page-header__btn page-header__btn-all" data-filter="all">ВСЕ</button>
        <button class="page-header__btn page-header__btn-active" data-filter="completed">ВЫПОЛНЕННЫЕ</button>
        <button class="page-header__btn page-header__btn-done" data-filter="active">АКТИВНЫЕ</button>
    </nav>
</header>
<main class="main-content">
    <div class="main-content__add-task">
        <form method="post" class="add-task-form">
            <textarea name="title" placeholder="Напишите новую задачу" autocomplete="off"></textarea>
            <input type="hidden" name="action" value="create">
            <button type="button" class="add-task-form__btn">ДОБАВИТЬ</button>
        </form>
    </div>
    <div class="main-content__tasks-list">
        <?php foreach ($tasks as $task): ?>
            <div class="task" data-status="<?= $task['status'] ?>" data-id="<?= $task['id'] ?>">
                <div class="task__description">
                    <p><?= htmlspecialchars($task['title']) ?></p>
                </div>
                <div class="task__actions">
                    <form method="post" class="task__action task__action--toggle">
                        <input type="hidden" name="action" value="toggle">
                        <input type="hidden" name="id" value="<?= $task['id'] ?>">
                        <button type="button" class="task__btn task__btn--toggle">
                            <?php if ($task['status'] === 1): ?>
                                <img src="/src/assets/images/check.svg" alt="Выполнено">
                            <?php endif ?>
                        </button>
                    </form>
                    <form method="post" class="task__action task__action--delete">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= $task['id'] ?>">
                        <button type="button" class="task__btn task__btn--delete"></button>
                    </form>
                </div>
            </div>
        <?php endforeach; ?>
</main>
</body>
</html>

