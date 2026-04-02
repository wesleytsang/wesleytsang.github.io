import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TradesComponent } from './components/trades/trades.component';
import { SignalsComponent } from './components/signals/signals.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trades', component: TradesComponent },
  { path: 'signals', component: SignalsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
