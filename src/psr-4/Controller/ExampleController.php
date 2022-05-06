<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ResponseInterface;

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
}