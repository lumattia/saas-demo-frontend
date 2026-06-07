import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../../../shared/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, LanguageSelectorComponent, ThemeToggleComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private router = inject(Router);
  loading = false;
  password='';

  ngOnInit(){
    if(this.auth.isAuthenticated()){
      const availableModules = this.auth.modules();
      if (availableModules.length > 0) {
        const firstModule = availableModules[0];
        const moduleRouteMap: { [key: string]: string } = {
          'DRESS': '/dresses',
          'DRESS_MOVEMENT': '/dress-movements',
          'TENANT': '/tenants',
          'USER': '/users'
        };
        const route = moduleRouteMap[firstModule] || '/dresses';
        this.router.navigate([route]);
      } else {
        this.router.navigate(['/dresses']);
      }
    }
  }
  createDemo() {
    this.loading = true;
    this.auth.createDemoAccount().subscribe({
      next: (res) => {
        this.loading = false,
        this.password=res.password;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error creating demo:', err);
      }
    });
  }
}
