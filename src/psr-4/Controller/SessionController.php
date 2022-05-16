<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface;
use FAFL\RecJunioPhp\Security\Permission;
use FAFL\RecJunioPhp\Security\Validation;
use FAFL\RecJunioPhp\Data\Connection;
use PDO;

class SessionController
{
  public function sessionStatus(MyResponse $response): ResponseInterface
  {
    $permission = new Permission;
    return $response->withJson($permission->getPermissionLevel());
  }

  public function login(Request $request, MyResponse $response): ResponseInterface
  {
    $data = [];
    $body = $request->getParsedBody();
    $body['username'] = trim($body['username']);

    $validation = new Validation();
    $val = $validation->validate(
      [
        [
          'value' => $body['username'], 'name' => 'El nombre de usuario', 'type' => 'string', 'constraints' => ['required' => 1, 'max-len' => 20],
          'messages' => ['msg-required' => 'es un campo requerido', 'msg-max-len' => 'no se encuentra registrado']
        ],
        [
          'value' => $body['password'], 'name' => 'La contraseña', 'type' => 'string', 'constraints' => ['required' => 1, 'max-len' => 50],
          'messages' => ['msg-required' => 'es un campo requerido']
        ]
      ]
    );

    if (is_array($val)) {
      $data = $val;
    } else {
      $pdo = Connection::getInstance();
      $query = $pdo->prepare("SELECT * FROM usuarios WHERE usuario = :username");
      $query->bindParam(':username', $body['username'], PDO::PARAM_STR);
      $query->execute();

      if ($result = $query->fetch(PDO::FETCH_ASSOC)) {
        if (md5($body['password']) == $result['clave']) {
          unset($result['clave']);
          $data = ['user' => $result];
          $_SESSION['coduser'] = $result['id_usuario'];
          $_SESSION['password'] = $body['password'];
          $_SESSION['last_access'] = time();
          $_SESSION['inactive_time'] = 10;
        } else {
          $data = ['msg' => 'La contraseña es incorrecta'];
        }
      } else {
        $data = ['msg' => 'El nombre de usuario no se encuentra registrado'];
      }
    }
    return $response->withJson($data);
  }

  public function closeSession(MyResponse $response): ResponseInterface
  {
    session_destroy();
    return $response->withJson(['msg' => 'Sesión cerrada con éxito']);
  }
}
