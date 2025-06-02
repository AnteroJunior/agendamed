import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { IRegister, IRegisterError } from '../../interfaces/register.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss'
})
export class RegisterPage {

  private http = inject(HttpClient)

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  handleSubmit(): void {
    console.log(this.registerForm.value);
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
