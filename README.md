# Introducción

> Muchas gracias por estar ahí disponible para mí. Sé que tomará un tiempo,
pero no te pido que lo termines, sino que me avances lo que puedas 😃🤗.

Lo que debes hacer es una web para gestión de los horarios de los 
profesores 👨‍🏫. En el front usarás JS (usa `fetch`, tengo permiso 🤣) y en
el back, Slim. Podrás ver más detalles dentro de la carpeta 
`sample-project`.

## Directorios

### `public`

Te recomiendo que apuntes la raíz de tu servidor web a esta carpeta, si es
posible. De todas maneras, he implementado un sistema de configuración que 
te permitirá meter el proyecto entero en la raíz o un subdirectorio de tu
servidor. Más detalles en el apartado de [configuración](#configuración).

### `sample-proyect`

Aquí encontrarás un proyecto demo que nos dio Miguel Ángel para aclarar la
funcionalidad del proyecto. Úsalo como guía de lo que debes hacer.

También puedes encontrar el script para construir la base de datos y el 
documento que explica los requisitos de la aplicación.

### `src`

Las clases se alojarán dentro de la carpeta `psr-4`, obedeciendo a una 
estructura de espacio de nombres acorde a la estructura de directorios. Si
te fijas en el archivo `composer.json`, el espacio de nombres principal 
será `FAFL\RecJunioPhp`, enlazado a esta misma carpeta de la que estamos 
hablando. De ahí, cada subdirectorio representará un nivel más en el 
espacio de nombres. Más detalles en la [documentación de 
composer](https://getcomposer.org/doc/04-schema.md#psr-4).

## Código

### `VendorExtend`

He extendido la clase Response de Slim para que enviar JSON sea más
sencillo, usando un método llamado `withJson`.

### `Data\Connection`

Esta será la clase que utilizarás para conectarte a la base de datos. Está
hecha en un patrón parecido al singleton. Simplemente llamas a 
`Connection::getInstance()` cuando necesites un objeto PDO. La 
configuración irá [por otro lado](#configuración).

### `api/index.php`

Si le echas un vistazo a este archivo, te habrás dado cuenta de que no 
utilizo Slim de manera usual. Lo junto con PHP-DI, un *inyector de
dependencias* que sirve para añadir [la clase `MyResponse`](#src) (aunque
no es imprescindible para hacerlo), y para añadir algo de flexibilidad
a la hora de crear las funciones manejadoras (como las de las rutas). 
Puedes averiguar más en su 
[documentación](https://php-di.org/doc/frameworks/slim.html). 

## Configuración

He usado [phpdotenv](https://github.com/vlucas/phpdotenv) para desacoplar 
la configuración del código. Es muy fácil de usar como podrás ver en su 
repositorio. He declarado por ahora unas cuantas variables, pero se podrán 
usar más a necesidad del desarrollador (hehe).

> Se usará un archivo .env **independiente** para cada uno de los dos, pero 
añadiré al repositorio uno de ejemplo. Es necesario que crees el tuyo 
propio.

### Variables generales

Las siguientes variables no necesitan explicación:

 * `DB_HOST`
 * `DB_NAME`
 * `DB_USER`
 * `DB_PASS`

### `DB_SCHEME`

Usada para definir el tipo de servicio que usará PDO para conectarse con 
la base de datos. Debe ser `mysql` por requerimiento del proyecto.

### `DB_PORT` - opcional

Tiene como valor por defecto `3306`, el puerto por defecto de MySQL.

### `APP_PUBLIC_PATH`

Si la raíz del servidor web apunta a la carpeta `public`, su valor será 
`/`. Si no, deberá ser la ruta hasta la carpeta public, terminando siempre 
con `/`.

> Ejemplo: Si la carpeta está dentro de 
> `/var/www/Proyectos/rec-junio-php/public`,
> siendo `/var/www` la raíz del servidor web, esta variable debe tener el 
> valor <code>"/Proyectos/rec-junio-php/public<u>/</u>"</code>
