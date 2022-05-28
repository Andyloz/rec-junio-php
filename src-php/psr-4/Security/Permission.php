<?php

namespace FAFL\RecJunioPhp\Security;

use PDO;
use FAFL\RecJunioPhp\Data\Connection;

class Permission
{
  public function getPermissionLevel(): array
  {
    if (!isset($_SESSION['coduser']) || !isset($_SESSION['password']) || !isset($_SESSION['last-access']))
      return ['not-logged' => 'No se ha iniciado sesión'];

    // Session time verification
    if ((time() - $_SESSION['last-access']) > (60 * $_SESSION['inactive-time'])) {
      session_unset();
      return ['time' => 'Tiempo de sesión expirado'];
    }

    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT * FROM usuarios WHERE id_usuario = :id");
    $query->bindParam('id', $_SESSION['coduser'], PDO::PARAM_INT);
    $query->execute();

    // Password verification
    if (!($result = $query->fetch())) {
      session_unset();
      return ['forbidden' => 'Zona restringida'];
    }

    if (md5($_SESSION['password']) != $result['clave']) {
      session_unset();
      return ['forbidden' => 'Zona restringida'];
    }

    $_SESSION['last-access'] = time();
    unset($result['clave']);
    return ['user' => $result];
  }
}
