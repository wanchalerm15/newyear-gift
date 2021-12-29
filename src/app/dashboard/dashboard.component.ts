import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { interval, lastValueFrom, Subscription, timer } from 'rxjs';
import { AppService, IGiftData } from '../app.service';
import { HistoryDialogComponent } from '../history-dialog/history-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  title: string = 'จับฉลากของขวัญปีใหม่ประจำปี 2564';
  countdown = new Date(2022, 0, 1, 0, 0, 0);
  timespan: string = '';
  step: number = 0;
  time!: Date;

  showFirework: boolean = false;

  private _timeSubscript?: Subscription;

  constructor(
    private _app: AppService,
    private _dialog: MatDialog
  ) {
    this._getTime();
    this._app.fetchItems();
    this._timeSubscript = interval(1000).subscribe(() => this._getTime());
  }

  get items() { return this._app.items; }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._timeSubscript?.unsubscribe();
  }

  onDelete(item: IGiftData) {
    if (!confirm(`คุณต้องการลบ "${item.name}" จริงหรือ?`)) return;
    this._app.delete(item.name).subscribe({
      next: () => this._app.socket.emit('emit', 'fetch-dashboard'),
      error: err => this._app.alert(err.message)
    });
  }

  onRandomNumber() {
    const len = this.items.length;
    const names = this.items.map(m => m.name);
    const _names: string[] = [];
    for (let index = len; index > 0; index--) {
      const rand = Math.floor(Math.random() * index);
      _names.push(names.splice(rand, 1)[0]);
    }
    const items = _names.map(m => this.items.find(s => s.name == m)!);
    this._app.setItems(items);
  }

  onHistory() {
    this._app.getItems('1')
      .subscribe(data => {
        this._dialog.open(HistoryDialogComponent, { data });
      });
  }

  onPlay() {
    this.step = 1;
  }

  onHide(item: IGiftData) {
    const prop = prompt('ระบุชื่อผู้ได้ของขวัญชิ้นนี้');
    if (prop && prop.trim() != '') {
      if (prop === '-') {
        item.open = false;
        return;
      }
      item.getn = prop;
      this._app.update(item)
        .subscribe({
          next: () => this._app.socket.emit('emit', 'fetch-dashboard'),
          error: err => this._app.alert(err.message)
        });
    }
  }

  async onSelect(item: IGiftData) {
    if (!confirm('คุณเลือกกล่องของขวัญนี้จริงหรือ?')) return;
    this.showFirework = true;
    item.open = true;
    await lastValueFrom(timer(3000));
    this.showFirework = false;
  }

  private _getTime() {
    this.time = new Date();
    const diff = moment(this.countdown).diff(moment());
    const du = moment.duration(diff);
    this.timespan = `${du.days()} วัน ${du.hours()} ชั่วโมง ${du.minutes()} นาที ${du.seconds()} วินาที`;
  }
}

