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
    usuario userId, 
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
    $scheduleRows = array_map(fn($row) => new ScheduleRow(...$row), $rawRows);
    $schedule = new Schedule($scheduleRows);

    return $response->withJson([
      'schedule' => $schedule,
    ]);
  }
}
