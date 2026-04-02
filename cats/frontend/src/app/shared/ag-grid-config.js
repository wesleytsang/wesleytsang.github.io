/**
 * Shared AG Grid default options.
 *
 * Inject `AgGridConfig` into any controller to get sensible defaults
 * and extend/override per-grid as needed.
 */
angular.module('catsApp').factory('AgGridConfig', [function () {
  return {
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    },
    pagination: true,
    paginationPageSize: 25,
    animateRows: true,
    domLayout: 'autoHeight',
    theme: 'ag-theme-alpine',
  };
}]);
