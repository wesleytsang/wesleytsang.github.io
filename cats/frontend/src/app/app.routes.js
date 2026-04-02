/**
 * Client-side routing.
 */
angular.module('catsApp').config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/dashboard', {
      template: '<cats-dashboard></cats-dashboard>',
    })
    .when('/trades', {
      template: '<cats-trades></cats-trades>',
    })
    .when('/signals', {
      template: '<cats-signals></cats-signals>',
    })
    .otherwise({ redirectTo: '/dashboard' });
}]);
