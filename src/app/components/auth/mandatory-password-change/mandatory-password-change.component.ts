import { Component, OnInit } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MaterialModule } from '../../../material.module';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';
import { AuthService } from 'src/app/services';
import { AppState } from 'src/app/common/store/app.store';
import { loginCompleted } from 'src/app/common/store/actions';
import { FRONT_ROUTE_TOKEN_AUTH_URL, FRONT_ROUTE_TOKEN_EMPTY } from 'src/app/common/config';
import { getDecodedAccessToken } from 'src/app/common/utils';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-mandatory-password-change',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppAuthBrandingComponent,
  ],
  templateUrl: './mandatory-password-change.component.html',
})
export class AppMandatoryPasswordChangeComponent implements OnInit {
  options = this.settings.getOptions();
  loading = false;
  error: string | null = null;

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
    private store: Store<AppState>,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Guards against landing here directly (refresh, back button, bookmark) —
    // the change-token only ever exists in-memory, set by the login effect.
    if (!this.authService.getChangeToken()) {
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

    this.authService.completeMandatoryPasswordChange(this.f.newPassword.value ?? '').subscribe({
      next: (res) => {
        this.authService.setChangeToken(null);
        const decoded = getDecodedAccessToken(res.token);
        this.store.dispatch(loginCompleted(res.token, decoded.sub));
        this.router.navigate([FRONT_ROUTE_TOKEN_EMPTY]);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se ha podido actualizar la contraseña.';
      },
    });
  }
}
