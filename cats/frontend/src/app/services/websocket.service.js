/**
 * WebSocketService — maintains a live connection to the trading engine
 * and broadcasts updates to interested controllers.
 */
angular.module('catsApp').service('WebSocketService', ['$rootScope', function ($rootScope) {
  let socket = null;

  this.connect = function (url) {
    if (socket) return;

    socket = new WebSocket(url);

    socket.onopen = () => {
      console.info('[CATS] WebSocket connected to', url);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      $rootScope.$broadcast('ws:message', data);
      $rootScope.$applyAsync();
    };

    socket.onerror = (err) => {
      console.error('[CATS] WebSocket error', err);
    };

    socket.onclose = () => {
      console.warn('[CATS] WebSocket closed — reconnecting in 5s');
      socket = null;
      setTimeout(() => this.connect(url), 5000);
    };
  };

  this.disconnect = function () {
    if (socket) {
      socket.close();
      socket = null;
    }
  };
}]);
