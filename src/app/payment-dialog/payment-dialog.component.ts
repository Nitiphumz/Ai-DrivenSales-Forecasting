import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {
  amount: number = 0;
  username: string = '';
  isProcessing: boolean = false;
  error: string = '';
  isDarkMode: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  getUserInfo() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    this.http.get<{ user_info: { points: number; username: string } }>(
      `${environment.BASE_URL}/user_info/`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.username = response.user_info.username;
      },
      error: (error) => {
        console.error('Failed to fetch user info:', error);
        this.error = 'Failed to load user information';
      }
    });
  }

  selectAmount(value: number) {
    this.amount = value;
  }

  processPayment() {
    if (!this.amount || this.amount < 1) {
      this.error = 'Please select an amount';
      return;
    }

    if (!this.username) {
      this.error = 'User information not available';
      return;
    }

    this.isProcessing = true;
    this.error = '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    const url = `${environment.BASE_URL}/create-payment-intent/?amount=${this.amount}&username=${this.username}`;

    this.http.post<{ payment_link: string; message: string }>(
      url,
      {},
      { headers }
    ).subscribe({
      next: (response) => {
        this.isProcessing = false;
        if (response.payment_link) {
          window.open(response.payment_link, '_blank');
          this.close.emit();
        }
      },
      error: (error) => {
        this.isProcessing = false;
        this.error = error.error?.message || 'Payment processing failed. Please try again.';
        console.error('Payment error:', error);
      }
    });
  }
}