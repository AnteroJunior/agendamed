import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.development';
import { MatButton } from '@angular/material/button';
import {
  provideNativeDateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IAppointment } from '../../interfaces/appointment.interface';

@Component({
  selector: 'app-appointment-update-modal',
  imports: [
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatSelectModule,
    MatFormFieldModule,
    MatButton,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  templateUrl: './appointment-update-modal.html',
  styleUrl: './appointment-update-modal.scss',
})
export class AppointmentUpdateModal {
  readonly dialogRef = inject(MatDialogRef<AppointmentUpdateModal>);
  private http: HttpClient = inject(HttpClient);
  private appointment = {};

  hours = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  updateForm = new FormGroup({
    speciality: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    doctor: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    schedule_day: new FormControl('', [Validators.required]),
    schedule_hour: new FormControl('', [Validators.required]),
    notes: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appointment_id: number }
  ) {
    this.http
      .get<IAppointment>(
        `${environment.apiUrl}/appointments/${this.data.appointment_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response: IAppointment) => {
          const datePart = (response.schedule_day as unknown as string).split('T')[0];
          const timePart = (response.schedule_day as unknown as string).split('T')[1].slice(0, 5);
          
          this.updateForm.patchValue({
            speciality: response.speciality.name,
            doctor: response.doctor.name,
            notes: response.notes,
            schedule_day: datePart + 'T' + '00:00:00.000',
            schedule_hour: timePart,
          });
          this.updateForm.updateValueAndValidity();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  handleSubmit() {
    const day = (this.updateForm.value.schedule_day as unknown as Date).toISOString().split('T')[0];
    this.http
      .put(
        `${environment.apiUrl}/appointments/${this.data.appointment_id}`,
        {
          schedule_day: day + 'T' + this.updateForm.value.schedule_hour + ':00Z', 
          notes: this.updateForm.value.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response) => {
          this.dialogRef.close();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
