import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  toggleDarkMode() {
    this.darkMode.next(!this.darkMode.value);
  }

  isDarkMode() {
    return this.darkMode.value;
  }
}