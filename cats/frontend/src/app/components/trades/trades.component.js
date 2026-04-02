/**
 * Trades component — AG Grid table of open and closed trades.
 */
angular.module('catsApp.trades', []).component('catsTrades', {
  templateUrl: 'app/components/trades/trades.html',
  controller: 'TradesController',
  controllerAs: 'vm',
});
