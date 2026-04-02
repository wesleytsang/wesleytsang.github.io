/**
 * SignalService — fetches signal data from the trading engine REST API.
 */
angular.module('catsApp').service('SignalService', ['$http', function ($http) {
  const BASE = '/api';

  this.getSignals = function () {
    return $http.get(`${BASE}/signals`).then(res => res.data);
  };
}]);
