<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\Data\Connection;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ResponseInterface;
use PDO;

class DataReadController
{
  public function obtainSchedule(int $userID, MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'El profesor ' . $userID . ' no tiene horario'];

    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT * FROM horario_lectivo WHERE usuario = :username");
    $query->bindParam('username', $userID, PDO::PARAM_INT);
    $query->execute();

    $result = $query->fetchAll();
    if ($result) $data = ['schedule' => $result];

    return $response->withJson($data);
  }
}
