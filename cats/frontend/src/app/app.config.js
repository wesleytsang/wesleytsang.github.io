/**
 * Global $http configuration and interceptors.
 */
angular.module('catsApp').config(['$httpProvider', function ($httpProvider) {
  // Attach JSON content-type to all requests
  $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

  // Global error interceptor — logs and re-throws HTTP errors
  $httpProvider.interceptors.push(['$q', function ($q) {
    return {
      responseError: function (rejection) {
        console.error('[CATS] HTTP error', rejection.status, rejection.config.url);
        return $q.reject(rejection);
      },
    };
  }]);
}]);
