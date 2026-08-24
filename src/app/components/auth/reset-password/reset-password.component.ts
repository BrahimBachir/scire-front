import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  ValidationErrors,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';
import { AuthService } from 'src/app/services';
import { FRONT_ROUTE_TOKEN_AUTH_URL } from 'src/app/common/config';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppAuthBrandingComponent,
  ],
  templateUrl: './reset-password.component.html',
})
export class AppResetPasswordComponent {
  options = this.settings.getOptions();
  loading = false;
  error: string | null = null;
  private token = '';

  form = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[a-zA-Z])(?=.*[0-9])/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatch },
  );

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService,
    activatedRoute: ActivatedRoute,
  ) {
    // The token arrives from an external mail link into a fresh, unauthenticated
    // tab — nothing to guard against beyond a missing token, since the token
    // itself is what the backend validates (PasswordResetGuard).
    this.token = activatedRoute.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.router.navigate([FRONT_ROUTE_TOKEN_AUTH_URL]);
    }
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    this.authService.resetPassword(this.token, this.f.newPassword.value ?? '').subscribe({
      next: () => {
        this.router.navigate([FRONT_ROUTE_TOKEN_AUTH_URL]);
      },
      error: () => {
        this.loading = false;
        this.error = 'This link is invalid or has expired. Please request a new one.';
      },
    });
  }
}
