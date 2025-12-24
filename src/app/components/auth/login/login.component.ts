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
import { MaterialModule } from '../../../material.module';
import { Store } from '@ngrx/store';
import { FRONT_ROUTE_TOKEN_EMPTY } from 'src/app/common/config';
import { submitLogin } from 'src/app/common/store/actions';
import { AppState } from 'src/app/common/store/app.store';
import { selectLogedIn, selectVerifying, selectverifyingEmail } from 'src/app/common/store/selectors';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';

@Component({
  selector: 'app-side-login',
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppAuthBrandingComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class AppLoginComponent  implements OnInit  {
  options = this.settings.getOptions();
  verifying$ = this.store.select(selectVerifying);
  verifyingEmail$ = this.store.select(selectverifyingEmail);

  constructor(
    private settings: CoreService,
    private router: Router, 
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.select(selectLogedIn).subscribe((logedIn) => {
      if (logedIn) this.router.navigate([FRONT_ROUTE_TOKEN_EMPTY]);
    });
  }

  form = new FormGroup({
    uname: new FormControl(environment.test_user, [Validators.required, Validators.minLength(6)]),
    password: new FormControl(environment.test_pass, [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
     if (this.form.invalid) {
      return;
    }

    const username = this.f['uname'].value ?? ''; // Get the username from the form group, default to empty string
    const password = this.f['password'].value ?? ''; // Get the password from the form group, default to empty string

    // Login Api
    this.store.dispatch(submitLogin({ username: username, password: password }));
  }
}
