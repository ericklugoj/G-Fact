# G-Fact :bar_chart:

G-Fact fue un proyecto para la materia de ingeniería de software, el sistema simula el proceso de facturación de nómina.

## **Características:**
 - Control de usuarios (Login y registro de usuarios).
 - Dashboard principal con información critica (número total de empleados registrados y nóminas enviadas).
 - Permite añadir y editar empleados (no se pueden eliminar).
 - Permite timbrar (de manera simulada) la nómina individual de cada empleado.
 - Al timbrar una factura se genera un reporte en formato PDF que contiene toda la información general del empleado, los dias pagados, si tiene o no retardos, faltas u otros pagos.
 - Envía un correo electrónico al empleado con su factura en formato PDF (el que se generó previamente).
 - El administrador puede desde el dashboard volver a enviar esa factura en PDF o visualizarla desde el navegador.
 - Vista con tablas que contienen información completa de los empleados .
 - Vista con tablas que contienen información detallada de las facturas que se han generado.
 
## **Tecnologías utilizadas**
**Backend:**
 - Node JS
 - Express
 - Passport (login y registro)

**Base de datos:**
- MySQL

**Frontend**
- HTML 5
- CSS 3
- Bootstrap 4
- Javascript vanilla
- Handlebars (motor de plantillas)

**Live preview: alojado en [Heroku](https://g-fact.herokuapp.com/)**

### Arrancar

Instalar dependencias y arrancar servidor.

```sh
$ cd dillinger
$ npm install -d
$ npm run start
```
