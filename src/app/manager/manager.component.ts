import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  complete: boolean = false;
  title: string = 'ลงทะเบียนจับของขวัญปีใหม่ 2564';

  constructor(
    private _fb: FormBuilder,
    private _app: AppService,
  ) {
    this.form = this._fb.group({
      name: ['', Validators.required],
      detail: [],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.get('image')?.invalid) {
      this._app.alert('กรุณาอัพโหลดภาพของขวัญ');
      return;
    }
    this.loading = true;
    this._app
      .create(this.form.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          this.complete = true;
          this._app.socket.emit('emit', 'fetch-dashboard');
        },
        error: err => this._app.alert(err.message)
      });
  }

  onUpload(input: HTMLInputElement) {
    try {
      const files = input.files;
      if (files?.length) {
        const file = files[0];
        const { type, size } = file;
        if (type.indexOf('image/') < 0) throw new Error('กรุณาอัพโหลดเป็นรูปภาพเข้ามา');
        if ((size / 1000) >= 1500) throw new Error('กรุณาอัพโหลดภาพไม่เกิน 1.5MB');
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => this.form.get('image')?.setValue(reader.result));
      }
    }
    catch (ex: any) {
      this._app.alert(ex.message);
      input.value = '';
    }
  }

}
