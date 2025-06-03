import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
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



import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
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
    MatInputModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private http: HttpClient = inject(HttpClient);
  appointments: IAppointment[] = [];
  readonly dialog = inject(MatDialog);

  filterForm = new FormGroup({
    status_code: new FormControl(''),
    schedule_day: new FormControl(''),
  })

  constructor() { }

  ngOnInit(): void {
    this.http
      .get<IAppointment[]>(`${environment.apiUrl}/appointments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }).subscribe({
        next: (response: IAppointment[]) => {
          this.appointments = response;
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
    this.http
      .get<IAppointment[]>(`${environment.apiUrl}/appointments?status_code=${this.filterForm.value.status_code}&schedule_day=${this.filterForm.value.schedule_day}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }).subscribe({
        next: (response: IAppointment[]) => {
          this.appointments = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}