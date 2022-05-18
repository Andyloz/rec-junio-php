<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\Data\Connection;
use FAFL\RecJunioPhp\Data\Schedule\Schedule;
use FAFL\RecJunioPhp\Data\Schedule\ScheduleRow;
use FAFL\RecJunioPhp\Security\Validation;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ResponseInterface;
use PDO;

class DataReadController
{
  public function obtainSchedule($userID, MyResponse $response): ResponseInterface
  {
    $validation = new Validation();
    $val = $validation->validate([
      [
        'value' => $userID, 'name' => 'El código de profesor', 'type' => 'int', 'constraints' => ['min-val' => 1, 'max-val' => 2147483647],
        'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
      ]
    ]);
    $data = $val;

    if (!is_array($val)) {

      $data = ['msg' => 'El profesor no existe'];
      $result = $this->checkIfUserExists($userID);

      if ($result) {
        $pdo = Connection::getInstance();
        $query = $pdo->prepare("SELECT id_horario id, usuario userId, dia day, hora hour, grupo groupId, g.nombre groupName, aula classroomId, a.nombre classroomName " .
          "FROM horario_lectivo JOIN aulas a ON a.id_aula = horario_lectivo.aula JOIN grupos g ON g.id_grupo = horario_lectivo.grupo WHERE usuario = :username AND dia " .
          "BETWEEN 1 AND 5 AND hora BETWEEN 1 AND 7");
        $query->bindParam('username', $userID, PDO::PARAM_INT);
        $query->execute();

        $rawRows = $query->fetchAll();
        $scheduleRows = array_map(fn ($row) => new ScheduleRow(...$row), $rawRows);
        $schedule = new Schedule($scheduleRows);
        $data = ['schedule' => $schedule];
      }
    }
    return $response->withJson($data);
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

  public function obtainFreeClassrooms($userID, $day, $hour, MyResponse $response): ResponseInterface
  {
    $val = $this->validateObtainClassroomArguments($userID, $day, $hour);
    $data = $val;

    if (!is_array($val)) {

      $data = ['msg' => 'El profesor no existe'];
      $result = $this->checkIfUserExists($userID);

      if ($result) {
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
      }
    }
    return $response->withJson($data);
  }

  public function obtainOccupiedClassrooms($userID, $day, $hour, MyResponse $response): ResponseInterface
  {
    $val = $this->validateObtainClassroomArguments($userID, $day, $hour);
    $data = $val;

    if (!is_array($val)) {
      
      $data = ['msg' => 'El profesor no existe'];
      $result = $this->checkIfUserExists($userID);

      if ($result) {
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
      }
    }
    return $response->withJson($data);
  }

  private function obtainGroups(string $queryString): int|array
  {
    $data = 0;
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT * FROM grupos WHERE $queryString");
    $query->execute();

    $result = $query->fetchAll();
    if ($result) $data = $result;
    return $data;
  }

  private function validateObtainClassroomArguments($userID, $day, $hour): int|array
  {
    $validation = new Validation();
    return $validation->validate([
      [
        'value' => $userID, 'name' => 'El código de profesor', 'type' => 'int', 'constraints' => ['min-val' => 1, 'max-val' => 2147483647],
        'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
      ],
      [
        'value' => $day, 'name' => 'El código de día', 'type' => 'int', 'constraints' => ['min-val' => 1, 'max-val' => 5],
        'messages' => ['msg-min-val' => 'debe estar entre 1 y 5', 'msg-max-val' => 'debe estar entre 1 y 5']
      ],
      [
        'value' => $hour, 'name' => 'El código de hora', 'type' => 'int', 'constraints' => ['min-val' => 1, 'max-val' => 7],
        'messages' => ['msg-min-val' => 'debe estar entre 1 y 7', 'msg-max-val' => 'debe estar entre 1 y 7']
      ]
    ]);
  }

  private function checkIfUserExists($userID): int|array
  {
    $data = 0;
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = :userID");
    $query->bindParam('userID', $userID, PDO::PARAM_INT);
    $query->execute();

    $result = $query->fetch();
    if ($result) $data = $result;
    return $data;
  }

  private function checkClassroomInHour(int $userID, int $day, int $hour): int|array
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
