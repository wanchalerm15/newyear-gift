import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGiftData } from '../app.service';

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss']
})
export class DetailDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IGiftData,
    private _dialog: MatDialogRef<DetailDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onClose() { this._dialog.close(); }
}
