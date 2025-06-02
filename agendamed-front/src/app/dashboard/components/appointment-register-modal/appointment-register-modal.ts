import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-appointment-register-modal',
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatSelectModule, MatFormFieldModule],
  templateUrl: './appointment-register-modal.html',
  styleUrl: './appointment-register-modal.scss'
})
export class AppointmentRegisterModal {
  readonly dialogRef = inject(MatDialogRef<AppointmentRegisterModal>);
  specialities = ['a', 'b', 'c'];
  doctors = [];

  registerForm = new FormGroup({
    speciality_id: new FormControl('', [Validators.required]),
    doctor_id: new FormControl('', [Validators.required]),
    schedule_day: new FormControl('', [Validators.required]),
    notes: new FormControl('', [Validators.required]),
  });

  handleSpecialtyChange(specialtyId: number) {}

  handleSubmit() {
    console.log(this.registerForm.value);
  }
}
