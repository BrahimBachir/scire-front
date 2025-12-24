import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from '../../../material.module';
import { AuthService } from 'src/app/services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DigitInputDirective } from 'src/app/common/directives/digit-input.directive';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { verificationCompleted } from 'src/app/common/store/actions';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';

@Component({
  selector: 'app-email-verification',
  imports: [
    RouterModule, MaterialModule, AppAuthBrandingComponent, ReactiveFormsModule, DigitInputDirective
  ],
  templateUrl: './email-verification.component.html',
})
export class EmailVerificationComponent {
  options = this.settings.getOptions();
  userCode: string = '';
  invalidCode: boolean = false;
  codeResent: boolean = false;
  attempts: number = 0;
  constructor(
    private store: Store<AppState>,
    private readonly authService: AuthService,
    private settings: CoreService,
    private router: Router,
    activatedRouter: ActivatedRoute,
  ) {
    this.userCode = activatedRouter?.snapshot?.paramMap?.get('code') || '';
    if(!this.userCode || this.userCode === '') this.router.navigate([``]);
  }

  form = new FormGroup(
    Object.fromEntries(
      ['one', 'two', 'three', 'four', 'five', 'six'].map(key => [
        key,
        new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9]$/), // ensures only one digit 0-9
          Validators.maxLength(1),
          Validators.minLength(1)
        ])
      ])
    )
  );

  get f() {
    return this.form.controls;
  }


  submit() {
    this.invalidCode = false;
    this.codeResent = false;
    this.attempts++;
    if (this.form.invalid) return;
    
    const code = +Object.values(this.form.value).join('');
    this.authService.validateCode(this.userCode, code).subscribe({
      next: (valid) => {
        console.log(valid)
        if(!valid) this.invalidCode = true;
        else {
          const data_parsed = Object.create(valid);
          let detokenized = this.getDecodedAccessToken(data_parsed.token);
          console.log("Data at code validation: ",valid)
          console.log("Data at code validation: ",detokenized)
          console.log(detokenized);                      ;
          this.store.dispatch(verificationCompleted(data_parsed.token,detokenized.sub));
          this.router.navigate([`auth/profile/${this.userCode}`]);
        }
      },
      error: (error) => {
        console.error(error)
        this.router.navigate([``]);
      }
    });
  }

  resendCode() {
    this.codeResent = false;
    this.authService.resendCode(this.userCode).subscribe({
      next:(data) =>{
        console.log(data)
        this.codeResent = true;
      },
      error: (error) => console.error(error)
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (Error) {
      return null;
    }
  }

}
