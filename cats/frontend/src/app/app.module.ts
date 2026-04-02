import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TradesComponent } from './components/trades/trades.component';
import { SignalsComponent } from './components/signals/signals.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, TradesComponent, SignalsComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, AgGridModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
