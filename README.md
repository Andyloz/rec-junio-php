`composer update`

`composer dump-autoload`

`npm install`

`npm run build`

## Configuración

He usado [phpdotenv](https://github.com/vlucas/phpdotenv) para desacoplar
la configuración del código. Es muy fácil de usar como se puede ver en su
repositorio.

> Se usará un archivo .env **independiente** para cada equipo, hay uno de ejemplo, 
pero es necesario que crear uno propio.

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
> valor <code>"/Proyectos/rec-junio-php/public<mark>/</mark>"</code>
 
