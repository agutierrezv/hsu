# HSU #
**Historial Social Unico**

Prototipo creado por **Icinetic** para **Ayesa**.

## Prerrequisitos ##

- MongoDB
- NodeJS

## Instalación 

- `npm install`


## Ejecución 

- `npm start`

## Test de unidad de backend

- `npm test`

## Test de unidad de frontend

- `npm run test-ui`

## Test de funcionales (e2e)

- `npm run protractor`

## Verificar calidad de código 

- `grunt jshint`

## Preparar version minimizada para publicar 

- `grunt release`

## Publicacion en Heroku
Teniendo instalado y configurado la heramienta `heroku-cli` [Heroku toolbelt](https://toolbelt.heroku.com/), lanzar:

`git push heroku master`

Donde `heroku` es un alias remoto al repositorio de apliacion en heroku de despliegue.

### Variables de entorno por despliegue ###
```
HSU_ENV = <entorno> production | qa | devel
MONGOLAB_URI = mongodb://<user>:<pass>/<server>.mongolab.com:<port>/<app>
NEW_RELIC_LICENSE_KEY = ....
NEW_RELIC_LOG = stdout
PAPERTRAIL_API_TOKEN = ....
```


 
Base generada por AppNow. https://appnow.radarconline.com