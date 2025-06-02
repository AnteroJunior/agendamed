import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILogin, ILoginError } from '../../interfaces/login.interface';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-login-page',
  providers: [HttpClient],
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

  private http = inject(HttpClient);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  handleSubmit(): void {
    console.log(this.loginForm.value);
    this.http.post<ILogin>(`${environment.apiUrl}/auth`, this.loginForm.value).subscribe({
      next: (response: ILogin) => {
        this.updateLocalStorage(response['access_token']);
        window.location.href = '/painel';
      },
      error: (error: ILoginError) => {
        console.log(error);
      }
    });
  }

  updateLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }
}
