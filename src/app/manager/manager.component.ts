import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('canvas') canvas?: ElementRef;

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
        const canvas = this.canvas?.nativeElement as HTMLCanvasElement;
        if (!canvas) throw new Error('เกิดข้อผิดพลาดแปลงรูปภาพไม่ได้');
        if (type.indexOf('image/') < 0) throw new Error('กรุณาอัพโหลดเป็นรูปภาพเข้ามา');
        // if ((size / 1000) >= 1500) throw new Error('กรุณาอัพโหลดภาพไม่เกิน 1.5MB');

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('เกิดข้อผิดพลาดแปลงรูปภาพไม่ได้');

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.addEventListener('load', () => {
          canvas.width = 800;
          canvas.height = canvas.width * (img.height / img.width);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          this.form.get('image')?.setValue(canvas.toDataURL('image/jpeg', 0.8));
        });
      }
    }
    catch (ex: any) {
      this._app.alert(ex.message);
      input.value = '';
    }
  }

}
