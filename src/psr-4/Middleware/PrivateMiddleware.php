<?php

namespace FAFL\RecJunioPhp\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ResponseInterface;
use FAFL\RecJunioPhp\Security\Permission;
use FAFL\RecJunioPhp\VendorExtend\MyResponse;

class PrivateMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): ResponseInterface
    {
        $permission = new Permission;
        $level = $permission->getPermissionLevel();

        if (array_key_exists('user', $level)) {
            $request = $request->withAttribute('level', $level);
            $response = $handler->handle($request);
        } else {
            $response = (new MyResponse())->withJson(['forbidden' => 'No tiene permiso para acceder a este servicio']);
        }

        return $response;
    }
}
