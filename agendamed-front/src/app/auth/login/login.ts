import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILogin, ILoginError } from '../interfaces/login.interface';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-login',
  providers: [HttpClient],
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  private http = inject(HttpClient);

  ngOnInit(): void {
    if (localStorage.getItem('access_token') != null) {
      window.location.href = '/painel';
    }
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  handleSubmit(): void {
    this.http.post<ILogin>(`${environment.apiUrl}/auth`, this.loginForm.value).subscribe({
      next: async(response: ILogin) => {
        this.updateLocalStorage(response['access_token']);
        window.location.href = '/painel';
      },
      error: (error: ILoginError) => {
        console.log(error);
      }
    });
  }

  updateLocalStorage(token: string) {
    localStorage.setItem('access_token', token);
  }
}
