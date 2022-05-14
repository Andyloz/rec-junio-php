<?php

// Session initialization
session_name('recjuniophp_fabianfranco_session');
session_start();

use DI\Bridge\Slim\Bridge;
use DI\Container;
use FAFL\RecJunioPhp\Controller\ExampleController;
use FAFL\RecJunioPhp\VendorExtend\MyResponseFactory;
use FAFL\RecJunioPhp\VendorExtend\MyErrorHandler;
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

// Add Body Parsing Middleware
$app->addBodyParsingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler(new MyErrorHandler);

// Example routes
$app->get('/hello/{name}', [ExampleController::class, 'sayHello']);
$app->get('/bye/{name}', [ExampleController::class, 'sayGoodbye']);
$app->get('/firstget', [ExampleController::class, 'firstGet']);

$app->run();
