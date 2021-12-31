import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, map, timer } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  private _items: IGiftData[] = [];
  private _showQR: boolean = false;

  constructor(
    private _snackbar: MatSnackBar,
    private _http: HttpClient
  ) {
    this._initializeLoadSocket();
  }

  get socket() { return this._socket; }
  get items() { return this._items; }
  get showQR() { return this._showQR; }

  setItems(items: IGiftData[], refresh = true) {
    let index = 0;
    if (refresh) this._items.splice(0);
    const _interval = interval(500).subscribe(() => {
      const item = items[index++];
      if (!item) return _interval.unsubscribe();
      this._items.push(item);
    });
  }

  setShowQR(status: boolean) {
    this._showQR = status;
  }

  fetchItems() {
    this._http
      .get<IGiftData[]>('db', { params: { filter: 0 } })
      .subscribe(res => {
        this._items = res;
        this._showQR = res.length <= 0;
      });
  }

  getItems(filter: string) {
    return this._http
      .get<IGiftData[]>('db', { params: { filter } });
  }

  create(data: any) {
    return this._http.post<IResponse>('db', data);
  }

  update(data: IGiftData) {
    return this._http.put<IResponse>('db', data);
  }

  delete(name: string) {
    return this._http.delete<IResponse>('db/' + encodeURIComponent(name));
  }

  alert(message: string) {
    this._snackbar.open(message, 'ตกลง', { duration: 2000 });
  }

  openSound(status: boolean) {
    const sound = document.getElementById('sound') as HTMLAudioElement;
    sound.volume = 1;
    if (status) sound.play();
    else {
      sound.volume = 0;
      sound.pause();
    }
  }

  private _initializeLoadSocket() {
    this._socket = io({ path: `${environment.apiURL}/socket.io` });
    this.socket.on('emit', (type: string, data: any) => this._emitSocket(type, data));
    this._socket.on('connect_error', err => {
      this.alert('เชื่อมต่อกับ Server ไม่ได้');
      this._socket.disconnect();
      console.error(err);
    });
  }

  private _emitSocket(type: string, data: any): void {
    switch (type) {
      case 'fetch-dashboard':
        this.fetchItems();
        break;
    }
  }
}

export interface IGiftData {
  id: number;
  name: string;
  detail: string;
  image: string;

  open: boolean;
  getn: string;
}

export interface IResponse {
  message: string;
  data: any;
}