<?php

namespace FAFL\RecJunioPhp\Security;

use PDO;
use FAFL\RecJunioPhp\Data\Connection;

class Permission
{
    public function getPermissionLevel(): mixed
    {
        if (isset($_SESSION['coduser']) && isset($_SESSION['password']) && isset($_SESSION['last_access'])) {

            // Session time verification
            if ((time() - $_SESSION['last_access']) > (60 * $_SESSION['inactive_time'])) {
                return ['time' => 'Tiempo de sesión expirado'];
            } else {
                $pdo = Connection::getInstance();
                $query = $pdo->prepare("SELECT * FROM usuarios WHERE id_usuario = :id");
                $query->bindParam(':id', $_SESSION['coduser'], PDO::PARAM_INT);
                $query->execute();

                // Password verification
                if ($result = $query->fetch(PDO::FETCH_ASSOC)) {
                    if (md5($_SESSION['password']) == $result['clave']) {
                        $_SESSION['last_access'] = time();
                        unset($result['clave']);
                        return ['user' => $result];
                    } else {
                        return ['forbidden' => 'Zona restringida'];
                    }
                } else {
                    return ['forbidden' => 'Zona restringida'];
                }
            }
        } else {
            return ['not_logged' => 'No se ha iniciado sesión'];
        }
    }
}
