var select = document.getElementById('select_empleados');

// Al seleccionar un empleado dentro de generar factura individual
select.addEventListener('click', function (e) {
    formulario = document.getElementById('formulario');
    formulario.classList.add('ocultar');
    formulario.classList.remove('fadeIn');
    $.ajax({
        method: "POST",
        url: "/facturas/getEmpleado",
        data: {
            id_empleado: select.value
        }
    }).done(function (data) {
        // Asignar valores de la BD a los campos de sueldo diario y correo
        document.getElementById("sueldo_diario").value = data[0].sueldo_diario;
        document.getElementById("correo").value = data[0].email;
        document.getElementById("id_empleado").value = data[0].id_empleado;
        document.getElementById("nombre_completo_empleado").value = `${data[0].nombres} ${data[0].apellidos}`;

        // Mostrar formulario
        formulario.classList.remove('ocultar');
        formulario.classList.add('animated', 'fadeIn');
    }).fail(function () {
        alert("Error al cargar datos de empleado");
    });
});

// Fechas