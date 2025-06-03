import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ISpeciality } from '../../interfaces/speciality.interface';
import { IDoctor } from '../../interfaces/doctor.interface';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-register-modal',
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
  templateUrl: './appointment-register-modal.html',
  styleUrl: './appointment-register-modal.scss',
})
export class AppointmentRegisterModal implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AppointmentRegisterModal>);
  private http: HttpClient = inject(HttpClient);

  specialities: ISpeciality[] = [];
  doctors: IDoctor[] = [];
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

  registerForm = new FormGroup({
    speciality_id: new FormControl('', [Validators.required]),
    doctor_id: new FormControl('', [Validators.required]),
    schedule_day: new FormControl('', [Validators.required]),
    schedule_hour: new FormControl('', [Validators.required]),
    notes: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.http
      .get<ISpeciality[]>(`${environment.apiUrl}/appointments/speciality`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .subscribe({
        next: (response: ISpeciality[]) => {
          this.specialities = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  handleSpecialityChange(event: any) {
    this.http
      .get<IDoctor[]>(
        `${environment.apiUrl}/appointments/speciality/${event.value}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response: IDoctor[]) => {
          this.doctors = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  handleSubmit() {
    const formDate = new Date(this.registerForm.value.schedule_day as unknown as Date).toISOString().split('T')[0];
    const formattedDate =  new Date(`${formDate}T${this.registerForm.value.schedule_hour}:00Z`);
    this.http
      .post(
        `${environment.apiUrl}/appointments`,
        {
          speciality_id: this.registerForm.value.speciality_id,
          doctor_id: this.registerForm.value.doctor_id,
          schedule_day: formattedDate,
          notes: this.registerForm.value.notes,
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
