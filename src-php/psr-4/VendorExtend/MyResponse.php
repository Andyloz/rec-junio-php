<?php

namespace FAFL\RecJunioPhp\VendorExtend;

use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Response;

class MyResponse extends Response
{
  public function withJson(mixed $payload): ResponseInterface
  {
    $clone = $this->withAddedHeader('Content-Type', 'application/json');
    $payload = json_encode($payload, JSON_UNESCAPED_UNICODE);
    $clone->body->write($payload);
    return $clone;
  }
}
