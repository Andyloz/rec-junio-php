<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\Data\Connection;
use FAFL\RecJunioPhp\Security\Validation;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use PDO;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;

class DataChangeController
{
  public function removeGroupInHour(Request $request, MyResponse $response): ResponseInterface
  {
    $body = $request->getParsedBody();

    $validation = new Validation();
    $val = $validation->validate([
      [
        'value' => $body['id-schedule'] ?? null, 'name' => 'El código de horario lectivo', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 2147483647],
        'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
      ]
    ]);
    $data = $val;

    if (!is_array($val)) {

      $pdo = Connection::getInstance();

      $query = $pdo->prepare("DELETE FROM horario_lectivo WHERE id_horario = :id");
      $query->bindParam('id', $body['id-schedule'], PDO::PARAM_INT);
      $query->execute();

      $data = ['success-msg' => 'El horario lectivo ha sido borrado con éxito'];
      $rows_affected = $query->rowCount();
      if ($rows_affected == 0) $data = ['msg' => 'El horario lectivo no existe'];
    }

    return $response->withJson($data);
  }

  public function editClassroomInHour(Request $request, MyResponse $response): ResponseInterface
  {
    $body = $request->getParsedBody();

    $validation = new Validation();
    $val = $validation->validate([
      [
        'value' => $body['id-classroom'] ?? null, 'name' => 'El código de aula', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 2147483647],
        'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
      ]
    ]);

    if (is_array($val)) {
      return $response->withJson($val);
    }

    $pdo = Connection::getInstance();

    $query = $pdo->prepare("SELECT id_aula FROM aulas WHERE id_aula = :classroomID");
    $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
    $query->execute();

    $resultClassroom = $query->fetch();
    if (!$resultClassroom) {
      return $response->withJson(['msg' => 'El aula no existe']);
    };

    if (!is_array($body['id-schedules'])) {
      return $response->withStatus(400);
    }

    foreach ($body['id-schedules'] as $idSchedule) {
      $query = $pdo->prepare("SELECT aula, dia, hora FROM horario_lectivo WHERE id_horario = :scheduleID");
      $query->bindParam('scheduleID', $idSchedule, PDO::PARAM_INT);
      $query->execute();

      $resultSchedule = $query->fetch();
      if (!$resultSchedule) {
        return $response->withJson(['msg' => 'El horario lectivo no existe']);
      }

      if ($resultSchedule['aula'] == $body['id-classroom']) {
        return $response->withJson(['msg' => 'Seleccione un aula diferente a la actual']);
      }

      $day = $resultSchedule['dia'];
      $hour = $resultSchedule['hora'];

      $query = $pdo->prepare("
       SELECT id_aula, nombre
       FROM aulas 
       WHERE id_aula = :classroomID 
         AND id_aula NOT IN 
             (SELECT DISTINCT aulas.id_aula 
              FROM aulas 
                  JOIN horario_lectivo ON aulas.id_aula = horario_lectivo.aula
              WHERE horario_lectivo.dia = :dayID 
                AND horario_lectivo.hora = :hourID 
                AND aulas.nombre <> 'Sin asignar o sin aula' 
              ORDER BY aulas.id_aula)"
      );
      $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
      $query->bindParam('dayID', $day, PDO::PARAM_INT);
      $query->bindParam('hourID', $hour, PDO::PARAM_INT);
      $query->execute();

      $result = $query->fetchAll();
      if (!$result) {
        return $response->withJson(['msg' => 'El aula seleccionada no está libre']);
      }
    }

    foreach ($body['id-schedules'] as $idSchedule) {
      $query = $pdo->prepare("UPDATE horario_lectivo SET aula = :classroomID WHERE id_horario = :scheduleID");
      $query->bindParam('scheduleID', $idSchedule, PDO::PARAM_INT);
      $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
      $query->execute();
    }

    return $response->withJson(
      ['success-msg' => 'El aula del horario lectivo ' . $body['id-classroom'] . ' ha sido editada con éxito']
    );
  }

  public function insertGroupInHour(Request $request, MyResponse $response): ResponseInterface
  {
    $body = $request->getParsedBody();

    $validation = new Validation();
    $val = $validation->validate([
      [
        'value' => $body['id-user'] ?? null, 'name' => 'El código de profesor', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 2147483647],
        'messages' => ['msg-min-val' => 'no está registrado', 'msg-max-val' => 'no está registrado']
      ],
      [
        'value' => $body['day'] ?? null, 'name' => 'El código de día', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 5],
        'messages' => ['msg-min-val' => 'debe estar entre 1 y 5', 'msg-max-val' => 'debe estar entre 1 y 5']
      ],
      [
        'value' => $body['hour'] ?? null, 'name' => 'El código de hora', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 7],
        'messages' => ['msg-min-val' => 'debe estar entre 1 y 7', 'msg-max-val' => 'debe estar entre 1 y 7']
      ],
      [
        'value' => $body['id-group'] ?? null, 'name' => 'El código de grupo', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 2147483647],
        'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
      ],
      [
        'value' => $body['id-classroom'] ?? null, 'name' => 'El código de aula', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 2147483647],
        'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
      ]
    ]);

    if (is_array($val)) return $response->withJson($val);

    $pdo = Connection::getInstance();
    $query = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = :userID");
    $query->bindParam('userID', $body['id-user'], PDO::PARAM_INT);
    $query->execute();

    $resultUser = $query->fetch();
    if (!$resultUser) return $response->withJson([
      'msg' => 'El profesor no existe'
    ]);

    $query = $pdo->prepare("SELECT id_grupo, nombre FROM grupos WHERE id_grupo = :groupID");
    $query->bindParam('groupID', $body['id-group'], PDO::PARAM_INT);
    $query->execute();

    $resultGroup = $query->fetch();
    if (!$resultGroup) return $response->withJson([
      'msg' => 'El grupo no existe'
    ]);

    $query = $pdo->prepare("SELECT id_aula, nombre FROM aulas WHERE id_aula = :classroomID");
    $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
    $query->execute();

    $resultClassroom = $query->fetch();
    if (!$resultClassroom) return $response->withJson([
      'msg' => 'El aula no existe'
    ]);

    if (!str_starts_with($resultGroup['nombre'], 'G') && $resultGroup['nombre'] != 'FDIR' && $resultClassroom['nombre'] == 'Sin asignar o sin aula')
      return $response->withJson([
        'msg' => 'El grupo ' . $resultGroup['nombre'] . ' debe tener un aula asignada'
      ]);

    if ((str_starts_with($resultGroup['nombre'], 'G') || $resultGroup['nombre'] == 'FDIR') && $resultClassroom['nombre'] != 'Sin asignar o sin aula')
      return $response->withJson([
        'msg' => 'El grupo ' . $resultGroup['nombre'] . ' no puede tener un aula asignada'
      ]);

    $query = $pdo->prepare("
SELECT horario_lectivo.id_horario, horario_lectivo.usuario, horario_lectivo.grupo, grupos.nombre, horario_lectivo.usuario
FROM horario_lectivo 
    JOIN aulas ON horario_lectivo.aula = aulas.id_aula
    JOIN grupos ON horario_lectivo.grupo = grupos.id_grupo 
WHERE horario_lectivo.dia = :dayID 
  AND horario_lectivo.hora = :hourID
  AND aulas.id_aula = :classroomID
  AND aulas.id_aula != 64"
    );
    $query->bindParam('dayID', $body['day'], PDO::PARAM_INT);
    $query->bindParam('hourID', $body['hour'], PDO::PARAM_INT);
    $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
    $query->execute();
    $occupiedScheduleResult = $query->fetchAll();

    $groupIsThere = !!array_filter($occupiedScheduleResult, fn($r) => $body['id-group'] === $r['grupo']);
    $userIsThere = !!array_filter($occupiedScheduleResult, fn($r) => $body['id-user'] === $r['usuario']);

    if ($groupIsThere && $userIsThere) {
      return $response->withJson([
        'msg' => 'No es posible añadir. El grupo y el profesor ya están asignados a ese horario',
      ]);
    }

    if (!$groupIsThere && !$userIsThere && !empty($occupiedScheduleResult)) {
      return $response->withJson([
        'msg' => 'No es posible añadir. El grupo y el profesor no están asignados a ese horario',
        'groups-in-classroom' => $occupiedScheduleResult
      ]);
    }

    $query = $pdo->prepare("
SELECT horario_lectivo.grupo, grupos.nombre nombre_grupo, horario_lectivo.aula, aulas.nombre nombre_aula 
FROM horario_lectivo 
    JOIN grupos ON horario_lectivo.grupo = grupos.id_grupo
    JOIN aulas ON horario_lectivo.aula = aulas.id_aula
WHERE horario_lectivo.usuario = :userID 
  AND horario_lectivo.dia = :dayID
  AND horario_lectivo.hora = :hourID"
    );
    $query->bindParam('userID', $body['id-user'], PDO::PARAM_INT);
    $query->bindParam('dayID', $body['day'], PDO::PARAM_INT);
    $query->bindParam('hourID', $body['hour'], PDO::PARAM_INT);
    $query->execute();

    $result = $query->fetchAll();

    if ($result) {
      foreach ($result as $scheduleRow) {

        if (str_starts_with($scheduleRow['nombre_grupo'], 'G') || $scheduleRow['nombre_grupo'] == 'FDIR')
          return $response->withJson([
            'msg' => 'No es posible añadir. Ya hay un grupo sin aula en esta hora en el horario del profesor ' . $body['id-user']
          ]);

        if (str_starts_with($resultGroup['nombre'], 'G') || $resultGroup['nombre'] == 'FDIR')
          return $response->withJson([
            'msg' => 'No es posible añadir un grupo sin aula en esta hora en el horario del profesor ' . $body['id-user'] . ' porque ya hay un grupo registrado'
          ]);

        if ($body['id-classroom'] != $scheduleRow['aula'])
          return $response->withJson([
            'msg' => 'No es posible añadir dos aulas en una misma hora'
          ]);

        if ($body['id-group'] == $scheduleRow['grupo'])
          return $response->withJson([
            'msg' => 'El grupo ' . $resultGroup['nombre'] . ' en el aula ' . $resultClassroom['nombre'] .
              ' ya está añadido a esta hora en el horario del profesor ' . $body['id-user']
          ]);
      }
    }

    $query = $pdo->prepare("INSERT INTO horario_lectivo (usuario, dia, hora, grupo, aula) VALUES (:userID, :dayID, :hourID, :groupID, :classroomID)");
    $query->bindParam('userID', $body['id-user'], PDO::PARAM_INT);
    $query->bindParam('dayID', $body['day'], PDO::PARAM_INT);
    $query->bindParam('hourID', $body['hour'], PDO::PARAM_INT);
    $query->bindParam('groupID', $body['id-group'], PDO::PARAM_INT);
    $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
    $query->execute();

    return $response->withJson([
      'success-msg' => 'El grupo ' . $resultGroup['nombre'] . ' en el aula ' . $resultClassroom['nombre'] . ' ha sido insertado con éxito en el horario del profesor ' .
        $body['id-user']
    ]);
  }
}
