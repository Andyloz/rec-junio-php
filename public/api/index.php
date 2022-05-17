<?php

// Session initialization
session_name('recjuniophp_fabianfranco_session');
session_start();

use DI\Bridge\Slim\Bridge;
use DI\Container;
use FAFL\RecJunioPhp\Controller\DataReadController;
use FAFL\RecJunioPhp\Controller\SessionController;
use FAFL\RecJunioPhp\Controller\DataChangeController;
use FAFL\RecJunioPhp\Controller\ExampleController;
use FAFL\RecJunioPhp\Middleware\AdminPrivateMiddleware;
use FAFL\RecJunioPhp\Middleware\ExternalMiddleware;
use FAFL\RecJunioPhp\Middleware\MixedPrivateMiddleware;
use FAFL\RecJunioPhp\Middleware\PrivateMiddleware;
use FAFL\RecJunioPhp\VendorExtend\MyResponseFactory;
use FAFL\RecJunioPhp\VendorExtend\MyErrorHandler;
use Psr\Http\Message\ResponseFactoryInterface;
use Slim\Routing\RouteCollectorProxy;

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

// Public routes
$app->get('/session-status', [SessionController::class, 'sessionStatus']);

// External purpose routes
$app->post('/login', [SessionController::class, 'login'])->add(new ExternalMiddleware);

// Private routes
$app->group('', function (RouteCollectorProxy $group) {

  $group->post('/logout', [SessionController::class, 'closeSession']);

  // Mixed private routes
  $group->get('/obtain-schedule/{userID}', [DataReadController::class, 'obtainSchedule'])
    ->add(new MixedPrivateMiddleware);

  // Admin private routes
  $group->group('', function (RouteCollectorProxy $group) {
    $group->get('/obtain-teachers', [DataReadController::class, 'obtainTeachers']);

    $group->get('/obtain-groups-with-classroom', [DataReadController::class, 'obtainGroupsWithClassroom']);
    $group->get('/obtain-groups-without-classroom', [DataReadController::class, 'obtainGroupsWithoutClassroom']);

    $group->get('/obtain-free-classrooms/{userID}/{day}/{hour}', [DataReadController::class, 'obtainFreeClassrooms']);
    $group->get('/obtain-occupied-classrooms/{userID}/{day}/{hour}', [DataReadController::class, 'obtainOccupiedClassrooms']);

    $group->delete('/remove-group-in-hour', [DataChangeController::class, 'removeGroupInHour']);
  })->add(new AdminPrivateMiddleware);
})->add(new PrivateMiddleware);

$app->run();
