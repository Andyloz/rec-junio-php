<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\Data\Connection;
use FAFL\RecJunioPhp\Security\Validation;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use PDO;

class DataChangeController
{
  public function removeGroupInHour(Request $request, MyResponse $response): ResponseInterface
  {
    $data = ['msg' => 'El código de horario lectivo es un parámetro obligatorio'];
    $body = $request->getParsedBody();

    if (is_array($body) && array_key_exists('id-schedule', $body)) {

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
    $val = $validation->validate(
      [
        [
          'value' => $body['id-schedule'], 'name' => 'El código de horario lectivo', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 2147483647],
          'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
        ],
        [
          'value' => $body['id-classroom'], 'name' => 'El código de aula', 'type' => 'int', 'constraints' => ['required' => 1, 'min-val' => 1, 'max-val' => 2147483647],
          'messages' => ['msg-min-val' => 'no es válido', 'msg-max-val' => 'no es válido']
        ]
      ]
    );

    $data = $val;

    if (!is_array($val)) {
      $pdo = Connection::getInstance();

      $query = $pdo->prepare("SELECT aula, dia, hora FROM horario_lectivo WHERE id_horario = :scheduleID");
      $query->bindParam('scheduleID', $body['id-schedule'], PDO::PARAM_INT);
      $query->execute();

      $resultSchedule = $query->fetch();
      if (!$resultSchedule) $data = ['msg' => 'El horario lectivo no existe'];

      $query = $pdo->prepare("SELECT id_aula FROM aulas WHERE id_aula = :classroomID");
      $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
      $query->execute();

      $resultClassroom = $query->fetch();
      if (!$resultClassroom) $data = ['msg' => 'El aula no existe'];

      if ($resultSchedule && $resultClassroom) {

        $data = ['msg' => 'Seleccione un aula diferente a la actual'];
        if ($resultSchedule['aula'] != $body['id-classroom']) {
          $day = $resultSchedule['dia'];
          $hour = $resultSchedule['hora'];

          $query = $pdo->prepare("SELECT id_aula, nombre FROM aulas WHERE id_aula = :classroomID AND id_aula NOT IN (SELECT DISTINCT aulas.id_aula FROM aulas JOIN horario_lectivo " .
            "ON aulas.id_aula = horario_lectivo.aula WHERE horario_lectivo.dia = :dayID AND horario_lectivo.hora = :hourID AND aulas.nombre <> 'Sin asignar o sin aula' ORDER BY aulas.id_aula)");
          $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
          $query->bindParam('dayID', $day, PDO::PARAM_INT);
          $query->bindParam('hourID', $hour, PDO::PARAM_INT);
          $query->execute();

          $result = $query->fetchAll();
          $data = ['msg' => 'El aula seleccionada no está libre'];
          if ($result) {
            $query = $pdo->prepare("UPDATE horario_lectivo SET aula = :classroomID WHERE id_horario = :scheduleID");
            $query->bindParam('scheduleID', $body['id-schedule'], PDO::PARAM_INT);
            $query->bindParam('classroomID', $body['id-classroom'], PDO::PARAM_INT);
            $query->execute();
            $data = ['success-msg' => 'El aula del horario lectivo ' . $body['id-classroom'] . ' ha sido editada con éxito'];
          }
        }
      }
    }

    return $response->withJson($data);
  }
}
