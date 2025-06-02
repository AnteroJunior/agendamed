import { Component, Input, input, InputSignal, signal } from '@angular/core';
import { IAppointment } from '../../interfaces/appointment.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-list',
  imports: [CommonModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss'
})
export class AppointmentList {
  @Input() appointments: IAppointment[] = [];
  constructor() {}
}

