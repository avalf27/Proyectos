// Definir la aplicación AngularJS
var app = angular.module('todoApp', []);

// Controlador para la lista de tareas
app.controller('todoController', function($scope) {
  // Lista inicial de tareas
  $scope.tasks = [];

  // Agregar una nueva tarea
  $scope.addTask = function() {
    if ($scope.newTask && $scope.newTask.trim() !== "") {
      $scope.tasks.push({ name: $scope.newTask.trim(), completed: false });
      $scope.newTask = ""; // Limpiar el input
    }
  };

  // Marcar o desmarcar una tarea como completada
  $scope.toggleTask = function(task) {
    task.completed = !task.completed;
  };

  // Eliminar una tarea
  $scope.deleteTask = function(task) {
    const index = $scope.tasks.indexOf(task);
    console.log(index);
    if (index > -1) {
      $scope.tasks.splice(index, 1);
    }
  };
});
