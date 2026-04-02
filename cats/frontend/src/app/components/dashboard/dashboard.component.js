/**
 * Dashboard component — high-level KPI overview.
 */
angular.module('catsApp.dashboard', []).component('catsDashboard', {
  templateUrl: 'app/components/dashboard/dashboard.html',
  controller: 'DashboardController',
  controllerAs: 'vm',
});
