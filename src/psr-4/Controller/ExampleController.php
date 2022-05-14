<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ResponseInterface;

use FAFL\RecJunioPhp\Data\Connection;

class ExampleController
{
  public function sayHello(string $name, MyResponse $response): ResponseInterface
  {
    return $response->withJson([
      'msg' => "Hello $name!"
    ]);
  }

  public function sayGoodbye(string $name, MyResponse $response): ResponseInterface
  {
    return $response->withJson([
      'msg' => "Goodbye $name!"
    ]);
  }

  public function firstGet(MyResponse $response): ResponseInterface
  {
    $pdo = Connection::getInstance();
    $query = $pdo->prepare('SELECT * FROM aulas');
    $query->execute();
    $result = $query->fetchAll();
    return $response->withJson([
      'classroom' => $result
    ]);
  }
}
