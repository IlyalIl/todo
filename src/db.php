<?php

function getPDO()
{
    $dsn = "mysql:host=localhost;dbname=todo_db;charset=utf8mb4";

    $user = "root";
    $password = "Qwerty145235!";

    $pdo = new PDO($dsn, $user, $password);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    return $pdo;
}