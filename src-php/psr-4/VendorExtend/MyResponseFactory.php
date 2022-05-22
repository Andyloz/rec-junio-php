<?php

namespace FAFL\RecJunioPhp\VendorExtend;

use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;

class MyResponseFactory implements ResponseFactoryInterface
{
  public function createResponse(int $code = 200, string $reasonPhrase = ''): ResponseInterface
  {
    return (new MyResponse())->withStatus($code, $reasonPhrase);
  }
}
