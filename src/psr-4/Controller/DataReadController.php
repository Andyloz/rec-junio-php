<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\Data\Connection;
use FAFL\RecJunioPhp\Data\Schedule\Schedule;
use FAFL\RecJunioPhp\Data\Schedule\ScheduleRow;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ResponseInterface;
use PDO;

class DataReadController
{
  public function obtainSchedule(int $userID, MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'El profesor ' . $userID . ' no tiene horario'];

    $pdo = Connection::getInstance();
    $query = $pdo->prepare("
SELECT 
    id_horario id,
    dia day,
    hora hour,
    grupo groupId,
    g.nombre groupName, 
    aula classroomId,
    a.nombre classroomName 
FROM horario_lectivo
JOIN aulas a ON a.id_aula = horario_lectivo.aula
JOIN grupos g ON g.id_grupo = horario_lectivo.grupo
WHERE usuario = :username AND dia BETWEEN 1 AND 5 AND hora BETWEEN 1 AND 7
    ");
    $query->bindParam('username', $userID, PDO::PARAM_INT);
    $query->execute();

    $rawRows = $query->fetchAll();
    $scheduleRows = array_map(fn ($row) => new ScheduleRow(...$row), $rawRows);
    $schedule = new Schedule($scheduleRows);

    return $response->withJson([
      'schedule' => $schedule,
    ]);
  }

  public function obtainTeachers(MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'No hay profesores'];
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT id_usuario, nombre, usuario, email FROM usuarios WHERE tipo = 'normal'");
    $query->execute();
    $result = $query->fetchAll();
    if ($result) $data = $result;

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

  public function obtainFreeClassrooms(int $userID, int $day, int $hour, MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'No hay aulas libres'];
    $result = $this->checkClassroomInHour($userID, $day, $hour);

    if ($result) {
      $data = $result;
    } else {
      $pdo = Connection::getInstance();
      $query = $pdo->prepare("SELECT id_aula, nombre FROM aulas WHERE id_aula NOT IN (SELECT DISTINCT aulas.id_aula FROM aulas JOIN horario_lectivo " .
        "ON aulas.id_aula = horario_lectivo.aula WHERE horario_lectivo.dia = :dayID AND horario_lectivo.hora = :hourID AND aulas.nombre <> 'Sin asignar o sin aula' ORDER BY aulas.id_aula)");
      $query->bindParam('dayID', $day, PDO::PARAM_INT);
      $query->bindParam('hourID', $hour, PDO::PARAM_INT);
      $query->execute();

      $result = $query->fetchAll();
      if ($result) $data = $result;
    }

    return $response->withJson($data);
  }

  public function obtainOccupiedClassrooms(int $userID, int $day, int $hour, MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'No hay aulas libres'];
    $result = $this->checkClassroomInHour($userID, $day, $hour);

    if ($result) {
      $data = $result;
    } else {
      $pdo = Connection::getInstance();
      $query = $pdo->prepare("SELECT aulas.id_aula, aulas.nombre, horario_lectivo.id_horario, horario_lectivo.usuario, horario_lectivo.grupo " .
        "FROM aulas JOIN horario_lectivo ON aulas.id_aula = horario_lectivo.aula WHERE horario_lectivo.dia = :dayID AND horario_lectivo.hora = :hourID " .
        "AND aulas.nombre <> 'Sin asignar o sin aula' ORDER BY aulas.id_aula");
      $query->bindParam('dayID', $day, PDO::PARAM_INT);
      $query->bindParam('hourID', $hour, PDO::PARAM_INT);
      $query->execute();

      $result = $query->fetchAll();
      if ($result) $data = $result;
    }

    return $response->withJson($data);
  }

  private function obtainGroups(string $queryString): int | array
  {
    $data = 0;
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT * FROM grupos WHERE $queryString");
    $query->execute();

    $result = $query->fetchAll();
    if ($result) $data = $result;
    return $data;
  }

  private function checkClassroomInHour(int $userID, int $day, int $hour): int | array
  {
    $data = 0;
    $pdo = Connection::getInstance();

    $query = $pdo->prepare("SELECT * FROM aulas JOIN horario_lectivo ON aulas.id_aula = horario_lectivo.aula WHERE horario_lectivo.usuario = :userID " .
      "AND horario_lectivo.dia = :dayID AND horario_lectivo.hora = :hourID");
    $query->bindParam('userID', $userID, PDO::PARAM_INT);
    $query->bindParam('dayID', $day, PDO::PARAM_INT);
    $query->bindParam('hourID', $hour, PDO::PARAM_INT);
    $query->execute();

    $result = $query->fetchAll();
    if ($result) $data = ['msg' => "La hora seleccionada del profesor $userID ya tiene un grupo asignado"];
    return $data;
  }
}
