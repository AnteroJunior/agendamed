import { Component, Input, ViewChild } from '@angular/core';
import { IAppointment } from '../../interfaces/appointment.interface';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-appointment-list',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss'
})
export class AppointmentList {
  @Input() appointments: IAppointment[] = [];

  tableColumns: string[] = ['doctor', 'speciality', 'schedule_day', 'notes', 'status_code', 'actions'];

  constructor() { }

  finish(id: number) {
    console.log(id);
  }

  cancel(id: number) {
    console.log(id);
  }

}

