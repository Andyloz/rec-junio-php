<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\Data\Connection;
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
}
