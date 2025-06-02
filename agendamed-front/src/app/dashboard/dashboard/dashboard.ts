import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IAppointment } from '../interfaces/appointment.interface';
import { environment } from '../../../environments/environment.development';
import { AppointmentList } from "../components/appointment-list/appointment-list";

@Component({
  selector: 'app-dashboard',
  imports: [AppointmentList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private http: HttpClient = inject(HttpClient);
  appointments: IAppointment[] = [];

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
}
