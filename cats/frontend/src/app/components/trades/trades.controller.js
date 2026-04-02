/**
 * TradesController — drives the AG Grid trades table.
 */
import { createGrid } from 'ag-grid-community';

angular.module('catsApp.trades').controller('TradesController', [
  '$element',
  'TradeService',
  'AgGridConfig',
  function ($element, TradeService, AgGridConfig) {
    const vm = this;
    vm.loading = true;
    vm.error = null;
    let gridApi = null;

    const columnDefs = [
      { field: 'id', headerName: 'Trade ID', maxWidth: 120 },
      { field: 'symbol', headerName: 'Symbol' },
      { field: 'side', headerName: 'Side' },
      { field: 'amount', headerName: 'Amount', valueFormatter: p => p.value?.toFixed(4) },
      { field: 'entry_price', headerName: 'Entry Price', valueFormatter: p => p.value?.toFixed(2) },
      { field: 'exit_price', headerName: 'Exit Price', valueFormatter: p => p.value?.toFixed(2) ?? '—' },
      { field: 'status', headerName: 'Status' },
      { field: 'opened_at', headerName: 'Opened At' },
      { field: 'closed_at', headerName: 'Closed At', valueFormatter: p => p.value ?? '—' },
    ];

    const gridOptions = Object.assign({}, AgGridConfig, { columnDefs, rowData: [] });

    vm.$onInit = function () {
      const container = $element[0].querySelector('#tradesGrid');
      gridApi = createGrid(container, gridOptions);
      loadTrades();
    };

    function loadTrades() {
      TradeService.getTrades()
        .then(trades => {
          gridApi.setGridOption('rowData', trades);
        })
        .catch(() => {
          vm.error = 'Failed to load trades.';
        })
        .finally(() => {
          vm.loading = false;
        });
    }

    vm.refresh = loadTrades;
  },
]);
