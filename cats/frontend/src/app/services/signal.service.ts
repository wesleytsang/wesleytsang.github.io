import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Signal {
  symbol: string;
  timestamp: string;
  close: number | null;
  volume: number | null;
  rsi: number | null;
  macd: number | null;
  macd_signal: number | null;
  macd_diff: number | null;
  bb_upper: number | null;
  bb_middle: number | null;
  bb_lower: number | null;
}

@Injectable({ providedIn: 'root' })
export class SignalService {
  private readonly base = '/api';

  constructor(private http: HttpClient) {}

  getSignals(): Observable<Signal[]> {
    return this.http.get<Signal[]>(`${this.base}/signals`);
  }
}
