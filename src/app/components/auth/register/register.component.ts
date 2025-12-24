import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { map, Observable, startWith } from 'rxjs';
import { matchPasswordsValidator } from 'src/app/common/helpers/confirm-password.helper';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthService } from 'src/app/services';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';
import { PassInfoComponent } from '../../generic/pass-info/pass-info';


@Component({
  selector: 'app-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, AppAuthBrandingComponent, TablerIconsModule, PassInfoComponent, MatProgressBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class AppRegisterComponent implements OnInit {
  options = this.settings.getOptions();
  showPass: boolean = false;
  creating: boolean = false;
  showConfirmPass: boolean = false;
  invalidCode: boolean = false;
  attempts: number = 0;
  max_attempts: number = 5;
  userCode: string = '';

  firstoption: string[] = ['Estudiante', 'Instructor'];
  filteredOptions: Observable<string[]>;

  constructor(private settings: CoreService, private router: Router, private service: AuthService) { }

  ngOnInit() {
    // first option
    /* this.filteredOptions = this.form.get('role')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    ); */
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.firstoption.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  form = new FormGroup(
    {
      email: new FormControl('ibraalberola@gmail.com', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]),
      password: new FormControl('Alejandro$1', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/)]),
      confirmPassword: new FormControl('Alejandro$1', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/),]),
    },
    { validators: matchPasswordsValidator }
  );

  get f() {
    return this.form.controls;
  }
  submit() {
    this.creating = true;
    if (this.form.invalid) return;

    const username = this.f['email'].value || '';
    const password = this.f['password'].value || '';
    this.service.createLogin({ username: username, password: password }).subscribe({
      next: (data) =>{
        this.creating = false;
        console.log(data)
        // If I recive a Bad request exception I want to display a dialog
        // If a recieve a 200 response I want to redirect to:
        this.router.navigate([`/auth/email-verification/${data.code}`]);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  showPassword() {
    this.showPass = !this.showPass;
  }

  showConfirmPassword() {
    this.showConfirmPass = !this.showConfirmPass;
  }

  resendCode() {
    this.service.resendCode(this.userCode).subscribe({});
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (Error) {
      return null;
    }
  }
}
