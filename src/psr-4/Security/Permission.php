<?php

namespace FAFL\RecJunioPhp\Security;

use PDO;
use FAFL\RecJunioPhp\Data\Connection;

class Permission
{
    public function getPermissionLevel(): mixed
    {
        if (isset($_SESSION['id']) && isset($_SESSION['key']) && isset($_SESSION['last_access'])) {

            // Session time verification
            if ((time() - $_SESSION['last_access']) > (60 * $_SESSION['inactive_time'])) {
                return array('time' => 'Tiempo de sesión expirado');
            } else {
                $pdo = Connection::getInstance();
                $query = $pdo->prepare("SELECT * FROM usuarios WHERE id_usuario = :id");
                $query->bindParam(':id', $_SESSION['id'], PDO::PARAM_INT);
                $query->execute();

                // Password verification
                if ($result = $query->fetch(PDO::FETCH_ASSOC)) {
                    if (md5($_SESSION['key']) == $result['keyuser']) {
                        $_SESSION['last_access'] = time();
                        unset($result['keyuser']);
                        return array('user' => $result);
                    } else {
                        return array('forbidden' => 'Zona restringida');
                    }
                } else {
                    return array('forbidden' => 'Zona restringida');
                }
            }
        } else {
            return array('not_logged' => 'No se ha iniciado sesión');
        }
    }
}
