import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppAuthBrandingComponent,
  ],
  templateUrl: './forgot-password.component.html',
})
export class AppForgotPasswordComponent {
  options = this.settings.getOptions();
  loading = false;
  sent = false;
  error: string | null = null;

  constructor(private settings: CoreService, private authService: AuthService) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    this.authService.forgotPassword(this.f.email.value ?? '').subscribe({
      next: () => {
        this.loading = false;
        this.sent = true;
      },
      error: () => {
        this.loading = false;
        this.error = 'No se ha podido enviar el correo. Inténtalo de nuevo.';
      },
    });
  }
}
