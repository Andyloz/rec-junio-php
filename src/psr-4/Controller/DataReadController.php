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

  public function obtainGroupsWithClassroom(MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'No hay grupos con aula'];
    $result = $this->obtainGroups("NOT nombre REGEXP '^[G].*$' AND nombre <> 'FDIR'");
    if ($result) $data = ['groups-with-classroom' => $result];

    return $response->withJson($data);
  }

  public function obtainGroupsWithoutClassroom(MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'No hay grupos sin aula'];
    $result = $this->obtainGroups("nombre REGEXP '^[G].*$' OR nombre = 'FDIR'");
    if ($result) $data = ['groups-without-classroom' => $result];

    return $response->withJson($data);
  }

  private function obtainGroups(string $query): int | array
  {
    $data = 0;
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT * FROM grupos WHERE $query");
    $query->execute();

    $result = $query->fetchAll();
    if ($result) $data = $result;
    return $data;
  }
}
