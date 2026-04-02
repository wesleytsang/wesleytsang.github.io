/**
 * DashboardController — fetches summary stats for the KPI tiles.
 */
angular.module('catsApp.dashboard').controller('DashboardController', [
  'TradeService',
  'SignalService',
  function (TradeService, SignalService) {
    const vm = this;
    vm.trades = [];
    vm.signals = [];
    vm.openTradesCount = 0;
    vm.closedTradesCount = 0;
    vm.loading = true;
    vm.error = null;

    function load() {
      vm.loading = true;
      Promise.all([TradeService.getTrades(), SignalService.getSignals()])
        .then(([trades, signals]) => {
          vm.trades = trades;
          vm.signals = signals;
          vm.openTradesCount = trades.filter(t => t.status === 'open').length;
          vm.closedTradesCount = trades.filter(t => t.status === 'closed').length;
        })
        .catch(err => {
          vm.error = 'Failed to load dashboard data.';
          console.error(err);
        })
        .finally(() => {
          vm.loading = false;
        });
    }

    load();
  },
]);
