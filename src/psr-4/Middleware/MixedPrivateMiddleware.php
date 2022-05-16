<?php

namespace FAFL\RecJunioPhp\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ResponseInterface;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Slim\Routing\RouteContext;

class MixedPrivateMiddleware
{
  public function __invoke(Request $request, RequestHandler $handler): ResponseInterface
  {
    $level = $request->getAttribute('level');
    $args = RouteContext::fromRequest($request)->getRoute()->getArguments();

    if ($level['user']['tipo'] == 'admin' || ($level['user']['tipo'] == 'normal' && $level['user']['id_usuario'] == $args['userID'])) {
      $request = $request->withAttribute('level', $level);
      $response = $handler->handle($request);
    } else {
      $response = (new MyResponse())->withJson(['forbidden' => 'No tiene permiso para acceder a este servicio']);
    }

    return $response;
  }
}
