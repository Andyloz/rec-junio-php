<?php

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
$dotenv
  ->required([
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASS',
  ])
  ->notEmpty();

$dotenv->ifPresent('DB_PORT')->isInteger();

$_ENV['DB_PORT'] = $_ENV['DB_PORT'] ?? 3306;

$dotenv->ifPresent('API_BASE_PATH')->notEmpty();

$_ENV['API_BASE_PATH'] = $_ENV['API_BASE_PATH'] ?? '/';
