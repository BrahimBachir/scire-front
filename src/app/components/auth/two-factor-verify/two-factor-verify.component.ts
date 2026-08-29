import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MaterialModule } from '../../../material.module';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';
import { AuthService } from 'src/app/services';
import { AppState } from 'src/app/common/store/app.store';
import { loginCompleted } from 'src/app/common/store/actions';
import { FRONT_ROUTE_TOKEN_AUTH_URL, FRONT_ROUTE_TOKEN_EMPTY } from 'src/app/common/config';
import { getDecodedAccessToken } from 'src/app/common/utils';

@Component({
  selector: 'app-two-factor-verify',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, AppAuthBrandingComponent],
  templateUrl: './two-factor-verify.component.html',
})
export class AppTwoFactorVerifyComponent implements OnInit {
  options = this.settings.getOptions();
  loading = false;
  resending = false;
  error: string | null = null;

  form = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  });

  constructor(
    private settings: CoreService,
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Guards against landing here directly (refresh, back button, bookmark) —
    // the twoFactorToken only ever exists in-memory, set by the login effect.
    if (!this.authService.getTwoFactorToken()) {
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

    this.authService.verifyTwoFactor(Number(this.f.code.value)).subscribe({
      next: (res) => {
        this.authService.setTwoFactorToken(null);
        const decoded = getDecodedAccessToken(res.token);
        this.store.dispatch(loginCompleted(res.token, decoded.sub));
        this.router.navigate([FRONT_ROUTE_TOKEN_EMPTY]);
      },
      error: () => {
        this.loading = false;
        this.error = 'Código incorrecto o caducado.';
      },
    });
  }

  resend(): void {
    this.resending = true;
    this.authService.resendTwoFactorCode().subscribe({
      next: () => (this.resending = false),
      error: () => (this.resending = false),
    });
  }
}
