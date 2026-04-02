/**
 * SignalsController — drives the AG Grid signals table.
 */
import { createGrid } from 'ag-grid-community';

angular.module('catsApp.signals').controller('SignalsController', [
  '$element',
  '$interval',
  'SignalService',
  'AgGridConfig',
  function ($element, $interval, SignalService, AgGridConfig) {
    const vm = this;
    vm.loading = true;
    vm.error = null;
    let gridApi = null;
    let poller = null;

    const columnDefs = [
      { field: 'symbol', headerName: 'Symbol' },
      { field: 'close', headerName: 'Price', valueFormatter: p => p.value?.toFixed(2) },
      { field: 'rsi', headerName: 'RSI', valueFormatter: p => p.value?.toFixed(2) },
      { field: 'macd', headerName: 'MACD', valueFormatter: p => p.value?.toFixed(4) },
      { field: 'macd_signal', headerName: 'MACD Signal', valueFormatter: p => p.value?.toFixed(4) },
      { field: 'bb_upper', headerName: 'BB Upper', valueFormatter: p => p.value?.toFixed(2) },
      { field: 'bb_lower', headerName: 'BB Lower', valueFormatter: p => p.value?.toFixed(2) },
      { field: 'timestamp', headerName: 'Updated At' },
    ];

    const gridOptions = Object.assign({}, AgGridConfig, { columnDefs, rowData: [] });

    vm.$onInit = function () {
      const container = $element[0].querySelector('#signalsGrid');
      gridApi = createGrid(container, gridOptions);
      loadSignals();
      // Auto-refresh every 60 s
      poller = $interval(loadSignals, 60_000);
    };

    vm.$onDestroy = function () {
      if (poller) $interval.cancel(poller);
    };

    function loadSignals() {
      SignalService.getSignals()
        .then(signals => {
          gridApi.setGridOption('rowData', signals);
        })
        .catch(() => {
          vm.error = 'Failed to load signals.';
        })
        .finally(() => {
          vm.loading = false;
        });
    }

    vm.refresh = loadSignals;
  },
]);
