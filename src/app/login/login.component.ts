import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    username: '',
    password: ''
  };

  isDarkMode = false;
  showPassword: boolean = false;
  showError: boolean = false;
  showSuccess: boolean = false;
  isClosing: boolean = false;
  isSuccessClosing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    this.showError = true;
    this.isClosing = false;

    setTimeout(() => {
      this.closeError();
    }, 3500);
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccess = true;
    this.isSuccessClosing = false;

    setTimeout(() => {
      this.closeSuccess();
    }, 3500);
  }

  closeError() {
    this.isClosing = true;
    setTimeout(() => {
      this.showError = false;
      this.isClosing = false;
    }, 300);
  }

  closeSuccess() {
    this.isSuccessClosing = true;
    setTimeout(() => {
      this.showSuccess = false;
      this.isSuccessClosing = false;
    }, 300);
  }

  onSubmit() {
    if (!this.loginData.username || !this.loginData.password) {
      this.showErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const formData = new FormData();
    formData.append('username', this.loginData.username);
    formData.append('password', this.loginData.password);

    this.http.post<LoginResponse>(`${environment.BASE_URL}/login`, formData)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.showSuccessMessage('เข้าสู่ระบบสำเร็จ');
          this.authService.setToken(response.token);
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login failed:', error);
          if (error.status === 401) {
            this.showErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
          } else {
            this.showErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
          }
        }
      });
  }
}