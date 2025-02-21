import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerData = {
    email:'',
    name: '',
    password: '',
    confirmPassword: ''
  };

  isDarkMode = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  constructor(
    private router: Router,
    private themeService: ThemeService,
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

  onSubmit() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerData.email);
    formData.append('password', this.registerData.password);

    this.http.post(`${environment.BASE_URL}/register`, formData)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed. Please try again.');
        }
      });
  }
}