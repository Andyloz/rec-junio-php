<?php

namespace FAFL\RecJunioPhp\Data;

use PDO;

class Connection
{
  private static ?PDO $singleton = null;

  private function __construct()
  {
    self::$singleton = new PDO(
      "{$_ENV['DB_SCHEME']}:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset={$_ENV['DB_CHARSET']};port={$_ENV['DB_PORT']}",
      $_ENV['DB_USER'],
      $_ENV['DB_PASS'],
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
      ]
    );
  }

  public static function getInstance(): PDO
  {
    if (!self::$singleton) {
      new self();
    }
    return self::$singleton;
  }
}
