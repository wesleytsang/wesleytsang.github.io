/**
 * CATS AngularJS root module.
 */
import 'angular';
import 'angular-route';

import './app.config';
import './app.routes';

// Services
import './services/trade.service';
import './services/signal.service';
import './services/websocket.service';

// Components
import './components/dashboard/dashboard.component';
import './components/trades/trades.component';
import './components/signals/signals.component';

// Shared
import './shared/ag-grid-config';

angular.module('catsApp', ['ngRoute', 'catsApp.dashboard', 'catsApp.trades', 'catsApp.signals']);
