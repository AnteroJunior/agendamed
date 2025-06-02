import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IAppointment } from '../interfaces/appointment.interface';
import { environment } from '../../../environments/environment.development';
import { AppointmentList } from "../components/appointment-list/appointment-list";
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Menu } from '../../shared/menu/menu';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentRegisterModal } from '../components/appointment-register-modal/appointment-register-modal';

@Component({
  selector: 'app-dashboard',
  imports: [AppointmentList, MatButtonModule, MatSidenavModule, Menu],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private http: HttpClient = inject(HttpClient);
  appointments: IAppointment[] = [];
  readonly dialog = inject(MatDialog);

  constructor() { }

  ngOnInit(): void {
    this.http.get<IAppointment[]>(`${environment.apiUrl}/appointments`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }).subscribe({
      next: (response: IAppointment[]) => {
        this.appointments = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  openRegisterDialog(): void {
    this.dialog.open(AppointmentRegisterModal, { width: '400px' });
  }
}
