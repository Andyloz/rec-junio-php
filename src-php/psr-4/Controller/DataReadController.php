<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\Data\Classroom\OccupiedClassroom;
use FAFL\RecJunioPhp\Data\Classroom\ScheduleClassroom;
use FAFL\RecJunioPhp\Data\Connection;
use FAFL\RecJunioPhp\Data\Group\Group;
use FAFL\RecJunioPhp\Data\Group\ScheduleGroup;
use FAFL\RecJunioPhp\Data\Schedule\Schedule;
use FAFL\RecJunioPhp\Data\Schedule\ScheduleInterval;
use FAFL\RecJunioPhp\Data\User\User;
use FAFL\RecJunioPhp\Security\Validation;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use PDO;
use Psr\Http\Message\ResponseInterface;

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

    if (is_array($val)) return $response->withJson($val);

    if (!$this->checkIfUserExists($userID))
      return $response->withJson([
        'msg' => 'El profesor no existe'
      ]);

    $pdo = Connection::getInstance();
    $query = $pdo->prepare("
SELECT
    JSON_ARRAYAGG(id_horario) ids, 
    dia day,
    hora hour,
    JSON_OBJECT('id', a.id_aula, 'name', a.nombre, 'scheduleRowIds', JSON_ARRAYAGG(id_horario)) `classroom`,
    JSON_ARRAYAGG(JSON_OBJECT('id', g.id_grupo, 'name', g.nombre, 'scheduleRowId', id_horario)) `groups`
FROM horario_lectivo 
    JOIN aulas a ON a.id_aula = horario_lectivo.aula
    JOIN grupos g ON g.id_grupo = horario_lectivo.grupo
WHERE usuario = :username
  AND dia BETWEEN 1 AND 5 
  AND hora BETWEEN 1 AND 7
GROUP BY day, hour, a.id_aula"
    );
    $query->bindParam('username', $userID, PDO::PARAM_INT);
    $query->execute();

    $rawIntervals = $query->fetchAll();
    $scheduleIntervals = array_map(
      function ($r) {
        $r['ids'] = json_decode($r['ids']);
        $r['classroom'] = json_decode($r['classroom']);
        $r['classroom'] = (array) $r['classroom'];
        $r['classroom'] = new ScheduleClassroom(...$r['classroom']);
        $r['groups'] = json_decode($r['groups']);
        $r['groups'] = array_map(function ($g) {
          $g = (array) $g;
          return new ScheduleGroup(...$g);
        }, $r['groups']);
        return new ScheduleInterval(...$r);
      },
      $rawIntervals
    );
    $schedule = new Schedule($scheduleIntervals);

    return $response->withJson([
      'schedule' => $schedule->scheduleRows,
    ]);
  }

  public function obtainTeachers(MyResponse $response): ResponseInterface
  {
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT id_usuario, nombre, usuario, email FROM usuarios WHERE tipo = 'normal'");
    $query->execute();
    $result = $query->fetchAll();

    if (!$result)
      return $response->withJson([
        'msg' => 'No hay profesores'
      ]);

    return $response->withJson([
      'teachers' => $result
    ]);
  }

  public function obtainGroupsWithClassroom(MyResponse $response): ResponseInterface
  {
    $result = $this->obtainGroups("NOT nombre REGEXP '^[G].*$' AND nombre <> 'FDIR'");

    if (!$result)
      return $response->withJson([
        'msg' => 'No hay grupos con aula'
      ]);

    return $response->withJson([
      'groups-with-classroom' => $result
    ]);
  }

  public function obtainGroupsWithoutClassroom(MyResponse $response): ResponseInterface
  {
    $result = $this->obtainGroups("nombre REGEXP '^[G].*$' OR nombre = 'FDIR'");

    if (!$result)
      return $response->withJson([
        'msg' => 'No hay grupos sin aula'
      ]);

    return $response->withJson([
      'groups-without-classroom' => $result
    ]);
  }

  public function obtainFreeClassrooms($day, $hour, MyResponse $response): ResponseInterface
  {
    $val = $this->validateObtainClassroomArguments($day, $hour);
    if (is_array($val)) return $response->withJson($val);

    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT id_aula id, nombre name FROM aulas WHERE id_aula NOT IN (SELECT DISTINCT aulas.id_aula FROM aulas JOIN horario_lectivo " .
      "ON aulas.id_aula = horario_lectivo.aula WHERE horario_lectivo.dia = :dayID AND horario_lectivo.hora = :hourID AND aulas.nombre <> 'Sin asignar o sin aula' ORDER BY aulas.id_aula)");
    $query->bindParam('dayID', $day, PDO::PARAM_INT);
    $query->bindParam('hourID', $hour, PDO::PARAM_INT);
    $query->execute();

    $result = $query->fetchAll();

    if (!$result)
      return $response->withJson([
        'msg' => 'No hay aulas libres'
      ]);

    return $response->withJson([
      'free-classrooms' => $result
    ]);
  }

  public function obtainOccupiedClassrooms($day, $hour, MyResponse $response): ResponseInterface
  {
    $val = $this->validateObtainClassroomArguments($day, $hour);
    if (is_array($val)) return $response->withJson($val);

    $pdo = Connection::getInstance();
    $query = $pdo->prepare("
SELECT 
    a.id_aula id, 
    a.nombre name,
    hl.id_horario scheduleRowId,
    g.id_grupo groupId,
    g.nombre groupName,
    u.id_usuario userId,
    u.nombre userName 
FROM aulas a
    JOIN horario_lectivo hl ON a.id_aula = hl.aula 
    JOIN grupos g ON g.id_grupo = hl.grupo 
    JOIN usuarios u ON u.id_usuario = hl.usuario 
WHERE hl.dia = :dayID 
  AND hl.hora = :hourID 
  AND a.nombre <> 'Sin asignar o sin aula' 
ORDER BY id"
    );
    $query->bindParam('dayID', $day, PDO::PARAM_INT);
    $query->bindParam('hourID', $hour, PDO::PARAM_INT);
    $query->execute();

    $rows = $query->fetchAll();

    if (!$rows)
      return $response->withJson([
        'msg' => 'No hay aulas ocupadas'
      ]);

    // group rows by id
    $rowsById = [];
    foreach ($rows as $row) {
      $rowsById[$row['id']][] = $row;
    }

    // make OccupiedClassrooms from grouped rows
    $occupiedClassrooms = [];
    foreach ($rowsById as $id => $rows) {
      $oc = new OccupiedClassroom($id, $rows[0]['name'], [], [], []);

      foreach ($rows as $row) {
        $oc->scheduleRowIds[] = $row['scheduleRowId'];
        $oc->groups[] = new Group($row['groupId'], $row['groupName']);
        $oc->users[] = new User($row['userId'], $row['userName']);
      }
      $oc->scheduleRowIds = array_unique($oc->scheduleRowIds);
      $oc->groups = array_unique($oc->groups, SORT_REGULAR);
      $oc->users = array_unique($oc->users, SORT_REGULAR);

      $occupiedClassrooms[] = $oc;
    }

    return $response->withJson([
      'occupied-classrooms' => $occupiedClassrooms
    ]);
  }

  private function obtainGroups(string $queryString): int|array
  {
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT id_grupo id, nombre name FROM grupos WHERE $queryString");
    $query->execute();

    $result = $query->fetchAll();
    if ($result) return $result;

    return 0;
  }

  private function validateObtainClassroomArguments($day, $hour): int|array
  {
    $validation = new Validation();
    return $validation->validate([
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
    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = :userID");
    $query->bindParam('userID', $userID, PDO::PARAM_INT);
    $query->execute();

    $result = $query->fetch();
    if ($result) return $result;

    return 0;
  }
}
