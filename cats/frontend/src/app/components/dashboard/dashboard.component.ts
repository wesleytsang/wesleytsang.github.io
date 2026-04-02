import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TradeService, Trade } from '../../services/trade.service';
import { SignalService, Signal } from '../../services/signal.service';

@Component({
  selector: 'cats-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  trades: Trade[] = [];
  signals: Signal[] = [];
  loading = true;
  error: string | null = null;

  get openTradesCount(): number {
    return this.trades.filter(t => t.status === 'open').length;
  }

  get closedTradesCount(): number {
    return this.trades.filter(t => t.status === 'closed').length;
  }

  constructor(private tradeService: TradeService, private signalService: SignalService) {}

  ngOnInit(): void {
    forkJoin({
      trades: this.tradeService.getTrades(),
      signals: this.signalService.getSignals(),
    }).subscribe({
      next: ({ trades, signals }) => {
        this.trades = trades;
        this.signals = signals;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard data.';
        this.loading = false;
      },
    });
  }
}
