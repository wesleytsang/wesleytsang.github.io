/**
 * TradeService — fetches trade data from the trading engine REST API.
 */
angular.module('catsApp').service('TradeService', ['$http', function ($http) {
  const BASE = '/api';

  this.getTrades = function () {
    return $http.get(`${BASE}/trades`).then(res => res.data);
  };
}]);
