<?php

namespace FAFL\RecJunioPhp\Controller;

use FAFL\RecJunioPhp\VendorExtend\MyResponse;
use FAFL\RecJunioPhp\Data\Connection;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface;

class SessionController
{
    public function sessionStatus(Request $request, MyResponse $response): ResponseInterface
    {
        $response_content = ['msg' => 'a'];



        return $response->withJson($response_content);
    }
}
