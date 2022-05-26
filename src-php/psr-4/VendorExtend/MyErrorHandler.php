<?php

namespace FAFL\RecJunioPhp\VendorExtend;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Throwable;

class MyErrorHandler
{
  public function __invoke(
    ServerRequestInterface $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails,
    ?LoggerInterface $logger = null
  ): ResponseInterface {
    $response = new MyResponse();
    error_log($exception->getMessage());

    return $response
      ->withJson([
        'error' => $exception->getMessage()
      ])
      ->withStatus(500);
  }
}
