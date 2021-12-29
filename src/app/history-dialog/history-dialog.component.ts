import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGiftData } from '../app.service';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IGiftData[]
  ) {
  }

  ngOnInit(): void {
  }

}
