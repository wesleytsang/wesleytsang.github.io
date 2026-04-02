import { Component, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { TradeService, Trade } from '../../services/trade.service';

@Component({
  selector: 'cats-trades',
  templateUrl: './trades.component.html',
})
export class TradesComponent implements OnInit {
  loading = true;
  error: string | null = null;
  rowData: Trade[] = [];

  columnDefs: ColDef<Trade>[] = [
    { field: 'id', headerName: 'Trade ID', maxWidth: 220 },
    { field: 'symbol', headerName: 'Symbol' },
    { field: 'side', headerName: 'Side' },
    { field: 'amount', headerName: 'Amount', valueFormatter: p => p.value?.toFixed(4) ?? '' },
    { field: 'entry_price', headerName: 'Entry Price', valueFormatter: p => p.value?.toFixed(2) ?? '' },
    { field: 'exit_price', headerName: 'Exit Price', valueFormatter: p => p.value?.toFixed(2) ?? '—' },
    { field: 'status', headerName: 'Status' },
    { field: 'opened_at', headerName: 'Opened At' },
    { field: 'closed_at', headerName: 'Closed At', valueFormatter: p => p.value ?? '—' },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    this.loadTrades();
  }

  loadTrades(): void {
    this.loading = true;
    this.error = null;
    this.tradeService.getTrades().subscribe({
      next: trades => {
        this.rowData = trades;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load trades.';
        this.loading = false;
      },
    });
  }
}
