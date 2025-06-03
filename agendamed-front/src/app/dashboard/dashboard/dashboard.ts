import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { IAppointment } from '../interfaces/appointment.interface';
import { environment } from '../../../environments/environment.development';
import { Menu } from '../../shared/menu/menu';
import { AppointmentRegisterModal } from '../components/appointment-register-modal/appointment-register-modal';
import { AppointmentList } from '../components/appointment-list/appointment-list';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    AppointmentList,
    MatButtonModule,
    MatSidenavModule,
    Menu,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private http: HttpClient = inject(HttpClient);
  appointments: IAppointment[] = [];
  readonly dialog = inject(MatDialog);
  private page = 1;
  total = 0;

  filterForm = new FormGroup({
    status_code: new FormControl(''),
    schedule_day: new FormControl(''),
  });

  constructor() {}

  ngOnInit(): void {
    this.http
      .get<{ appointments: IAppointment[]; total: number }>(
        `${environment.apiUrl}/appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response: { appointments: IAppointment[]; total: number }) => {
          this.appointments = response.appointments;
          this.total = +response.total;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  openRegisterDialog(): void {
    this.dialog.open(AppointmentRegisterModal, { width: '400px' });
  }

  handleSubmit() {
    let schedule_day = '';
    let status_code = '';

    if (this.filterForm.value.schedule_day) {
      const date = new Date(this.filterForm.value.schedule_day);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      schedule_day = `${year}-${month}-${day}`;
    }

    if (this.filterForm.value.status_code != null) {
      status_code = this.filterForm.value.status_code;
    }

    this.http
      .get<{ appointments: IAppointment[]; total: number }>(
        `${environment.apiUrl}/appointments?status_code=${status_code}&schedule_day=${schedule_day}&page=${this.page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response: { appointments: IAppointment[]; total: number }) => {
          this.appointments = response.appointments;
          this.total = +response.total;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.handleSubmit();
  }
}
