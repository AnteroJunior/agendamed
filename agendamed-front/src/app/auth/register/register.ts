import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { IRegister, IRegisterError } from '../interfaces/register.interface';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  private http = inject(HttpClient)

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  handleSubmit(): void {
    this.http.post<IRegister>(`${environment.apiUrl}/users`, this.registerForm.value).subscribe({
      next: (response: IRegister) => {
        alert(response.message);
        window.location.href = '/';
      },
      error: (error: IRegisterError) => {
        alert(error);
      }
    });
  }
}
