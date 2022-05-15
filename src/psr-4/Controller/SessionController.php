<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use Psr\Http\Message\ResponseInterface;
use FAFL\RecJunioPhp\Security\Permission;

class SessionController
{
    public function sessionStatus(MyResponse $response): ResponseInterface
    {
        $permission = new Permission;
        return $response->withJson($permission->getPermissionLevel());
    }
}
