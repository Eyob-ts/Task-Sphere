import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'preferred-theme';
  private readonly DARK_THEME = 'dark-theme';
  private readonly LIGHT_THEME = 'light-theme';

  private isDarkTheme = new BehaviorSubject<boolean>(this.loadThemePreference());
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor(private overlayContainer: OverlayContainer) {
    this.applyTheme(this.isDarkTheme.value);
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    this.applyTheme(newTheme);
    this.saveThemePreference(newTheme);
  }

  private applyTheme(isDark: boolean): void {
    const theme = isDark ? this.DARK_THEME : this.LIGHT_THEME;

    // Remove old theme classes
    document.body.classList.remove(this.DARK_THEME, this.LIGHT_THEME);
    this.overlayContainer.getContainerElement().classList.remove(this.DARK_THEME, this.LIGHT_THEME);

    // Add new theme class
    document.body.classList.add(theme);
    this.overlayContainer.getContainerElement().classList.add(theme);

    // Update Material theme
    if (isDark) {
      document.body.classList.add('mat-app-background');
      document.body.classList.add('mat-typography');
      document.body.classList.add('mat-dark-theme');
      document.body.classList.remove('mat-light-theme');
    } else {
      document.body.classList.add('mat-app-background');
      document.body.classList.add('mat-typography');
      document.body.classList.add('mat-light-theme');
      document.body.classList.remove('mat-dark-theme');
    }

    // Force Material to update its theme
    const style = document.createElement('style');
    style.textContent = `
      .mat-app-background {
        background-color: var(--primary-bg) !important;
      }
      .mat-toolbar {
        background-color: var(--secondary-bg) !important;
        color: var(--primary-text) !important;
      }
      .mat-card {
        background-color: var(--card-bg) !important;
        color: var(--primary-text) !important;
      }
      .mat-table {
        background-color: var(--primary-bg) !important;
        color: var(--primary-text) !important;
      }
    `;
    document.head.appendChild(style);
  }

  private loadThemePreference(): boolean {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return savedTheme === this.DARK_THEME;
  }

  private saveThemePreference(isDark: boolean): void {
    localStorage.setItem(this.THEME_KEY, isDark ? this.DARK_THEME : this.LIGHT_THEME);
  }
}
