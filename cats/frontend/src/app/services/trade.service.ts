import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  entry_price: number | null;
  exit_price: number | null;
  entry_rsi: number | null;
  exit_rsi: number | null;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at: string | null;
  order_id: string | null;
}

@Injectable({ providedIn: 'root' })
export class TradeService {
  private readonly base = '/api';

  constructor(private http: HttpClient) {}

  getTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.base}/trades`);
  }
}
