import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { IAppointment } from '../../interfaces/appointment.interface';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentUpdateModal } from '../appointment-update-modal/appointment-update-modal';

@Component({
  selector: 'app-appointment-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})
export class AppointmentList {
  @Input() appointments: IAppointment[] = [];
  private http: HttpClient = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  tableColumns: string[] = [
    'doctor',
    'speciality',
    'schedule_day',
    'notes',
    'status_code',
    'actions',
  ];

  constructor() {}

  finish(id: number) {
    this.http
      .patch(
        `${environment.apiUrl}/appointments/${id}/finish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response) => {
          this.updateList();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  cancel(id: number) {
    this.http
      .patch(
        `${environment.apiUrl}/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response) => {
          this.updateList();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  updateList() {
    this.http
      .get<IAppointment[]>(`${environment.apiUrl}/appointments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .subscribe({
        next: (response: IAppointment[]) => {
          this.appointments = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  openUpdateDialog(appointment_id: number): void {
    this.dialog.open(AppointmentUpdateModal, { data: { appointment_id: +appointment_id }, width: '400px' });

    this.dialog.afterAllClosed.subscribe(() => {
      this.updateList();
    })
  }
}
