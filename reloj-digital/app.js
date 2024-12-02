// Definir la aplicación AngularJS
var app = angular.module('relojApp', []);

// Controlador del reloj
app.controller('relojController', function($scope, $interval) {
  // Lista de zonas horarias comunes
  $scope.zonasHorarias = [
    "UTC",
    "America/New_York",
    "America/Tegucigalpa",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Europe/Madrid",
  ];

  // Zona horaria seleccionada (por defecto UTC)
  $scope.zonaHorariaSeleccionada = "Europe/Madrid";

  // Función para añadir ceros iniciales
  function formatearConCero(valor) {
    return valor.toString().length < 2 ? '0' + valor : valor;
  }

  // Función para obtener la hora ajustada según la zona horaria
  function obtenerHoraZonaHoraria(fecha, zonaHoraria) {
    return new Date(
      fecha.toLocaleString('en-US', { timeZone: zonaHoraria })
    );
  }

  // Función para actualizar la hora según la zona horaria
  function actualizarReloj() {
    const ahora = new Date();
    const horaZona = obtenerHoraZonaHoraria(ahora, $scope.zonaHorariaSeleccionada);

    // Obtener horas, minutos y segundos ajustados
    const horas = formatearConCero(horaZona.getHours());
    const minutos = formatearConCero(horaZona.getMinutes());
    const segundos = formatearConCero(horaZona.getSeconds());

    $scope.horaActual = `${horas}:${minutos}:${segundos}`;

    // Fecha ajustada con ceros iniciales
    const dia = formatearConCero(horaZona.getDate());
    const mes = formatearConCero(horaZona.getMonth() + 1); // Los meses van de 0 a 11
    const año = horaZona.getFullYear();

    $scope.fechaActual = `${dia}/${mes}/${año}`;
  }

  // Actualiza la zona horaria (cuando cambia el select)
  $scope.actualizarZonaHoraria = function() {
    actualizarReloj();
  };

  // Actualizar la hora automáticamente cada segundo
  $interval(actualizarReloj, 1000);

  // Llamada inicial para evitar el retardo del intervalo
  actualizarReloj();
});
