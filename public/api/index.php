<?php

use DI\Bridge\Slim\Bridge;
use DI\Container;
use FAFL\RecJunioPhp\Controller\ExampleController;
use FAFL\RecJunioPhp\VendorExtend\MyResponseFactory;
use Psr\Http\Message\ResponseFactoryInterface;

require __DIR__ . '/../../vendor/autoload.php';

// Custom Response object config
$container = new Container();
$container->set(ResponseFactoryInterface::class, function () {
  return new MyResponseFactory();
});

// App config
$app = Bridge::create($container);
$app->setBasePath("{$_ENV['APP_PUBLIC_PATH']}api");

// Example routes
$app->get('/hello/{name}', [ExampleController::class, 'sayHello']);
$app->get('/bye/{name}', [ExampleController::class, 'sayGoodbye']);
$app->get('/firstget', [ExampleController::class, 'firstGet']);

$app->run();
