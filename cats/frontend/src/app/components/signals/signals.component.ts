import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { interval, Subscription, switchMap } from 'rxjs';
import { SignalService, Signal } from '../../services/signal.service';

@Component({
  selector: 'cats-signals',
  templateUrl: './signals.component.html',
})
export class SignalsComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;
  rowData: Signal[] = [];

  columnDefs: ColDef<Signal>[] = [
    { field: 'symbol', headerName: 'Symbol' },
    { field: 'close', headerName: 'Price', valueFormatter: p => p.value?.toFixed(2) ?? '' },
    { field: 'rsi', headerName: 'RSI', valueFormatter: p => p.value?.toFixed(2) ?? '' },
    { field: 'macd', headerName: 'MACD', valueFormatter: p => p.value?.toFixed(4) ?? '' },
    { field: 'macd_signal', headerName: 'MACD Signal', valueFormatter: p => p.value?.toFixed(4) ?? '' },
    { field: 'bb_upper', headerName: 'BB Upper', valueFormatter: p => p.value?.toFixed(2) ?? '' },
    { field: 'bb_lower', headerName: 'BB Lower', valueFormatter: p => p.value?.toFixed(2) ?? '' },
    { field: 'timestamp', headerName: 'Updated At' },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  private pollSub: Subscription | null = null;

  constructor(private signalService: SignalService) {}

  ngOnInit(): void {
    this.loadSignals();
    // Auto-refresh every 60 s
    this.pollSub = interval(60_000).pipe(switchMap(() => this.signalService.getSignals())).subscribe({
      next: signals => (this.rowData = signals),
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadSignals(): void {
    this.loading = true;
    this.error = null;
    this.signalService.getSignals().subscribe({
      next: signals => {
        this.rowData = signals;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load signals.';
        this.loading = false;
      },
    });
  }
}
