import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private socket: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Emits every parsed message received from the server. */
  readonly messages$ = new Subject<unknown>();

  constructor(private zone: NgZone) {}

  connect(url: string): void {
    if (this.socket) return;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.info('[CATS] WebSocket connected to', url);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data: unknown = JSON.parse(event.data as string);
      this.zone.run(() => this.messages$.next(data));
    };

    this.socket.onerror = (err) => {
      console.error('[CATS] WebSocket error', err);
    };

    this.socket.onclose = () => {
      console.warn('[CATS] WebSocket closed — reconnecting in 5 s');
      this.socket = null;
      this.reconnectTimeout = setTimeout(() => this.connect(url), 5_000);
    };
  }

  disconnect(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.onclose = null; // prevent auto-reconnect
      this.socket.close();
      this.socket = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messages$.complete();
  }
}
