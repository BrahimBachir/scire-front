import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from '../../../material.module';
import { GendersService, RoleService } from 'src/app/services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { createUserLogin, logoutAction } from 'src/app/common/store/actions';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IGender, IRole, IUser } from 'src/app/common/models/interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { selectLogedIn } from 'src/app/common/store/selectors';
import { FRONT_ROUTE_TOKEN_EMPTY } from 'src/app/common/config';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';

@Component({
  selector: 'app-min-profile',
  imports: [
    RouterModule, 
    MaterialModule,
    AppAuthBrandingComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TablerIconsModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatDividerModule
  ],
  templateUrl: './min-account.component.html',
})
export class MinimumAccountComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  options = this.settings.getOptions();
  userCode: string = '';
  invalidCode: boolean = false;
  codeResent: boolean = false;
  attempts: number = 0;

  roles: IRole[] = [];
  selectedRole!: IRole;
  genders: IGender[] = [];
  selectedGender!: IGender;
  user!: IUser;

  constructor(
    //private store: Store<AppState>,
    private readonly gendersService: GendersService,
    private readonly rolesService: RoleService,
    private settings: CoreService,
    private activatedRouter: ActivatedRoute,
  ) {
  }
  ngOnInit(): void {
        this.store.select(selectLogedIn).subscribe((logedIn) => {
          if (logedIn) this.router.navigate([FRONT_ROUTE_TOKEN_EMPTY]);
        });
    this.userCode = this.activatedRouter?.snapshot?.paramMap?.get('code') || '';
    if(!this.userCode || this.userCode === '') this.store.dispatch(logoutAction());
    else this.form.get('code')?.setValue(this.userCode);
  
    this.getGenders();
    this.getRoles();
  }

  form = new FormGroup(
    {
      name: new FormControl('Ibra', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      first_surname: new FormControl('Prueba', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      second_surname: new FormControl('Prueba', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      code: new FormControl({ value: '', disabled: true}),
      gender: new FormControl(0, [Validators.required]),
      role: new FormControl(0, [Validators.required]),
    }
  );

  get f() {
    return this.form.controls;
  }

  submit() {
    this.creatingUser();
    this.store.dispatch(createUserLogin({user: this.user}))
  }

  getGenders(){
    this.gendersService.getAll().subscribe({
      next: (genders) => { 
        this.genders = genders;
        this.selectedGender = genders.find(g => g.by_default) || genders[0];
        if (this.selectedGender) this.form.get('gender')?.setValue(this.selectedGender.id);
      },
      error: (error) => console.error(error)
    })
  }
  
  getRoles(){
    this.rolesService.getAll().subscribe({
      next: (roles) => { 
        this.roles = roles;
        this.selectedRole = roles.find(r => r.by_default) || roles[0];
        if(this.selectedRole) this.form.get('role')?.setValue(this.selectedRole.id);
      },
      error: (error) => console.error(error)
    })
  }

  creatingUser(){
    if (!this.form.valid) this.form.markAllAsTouched();
    const formValues = this.form.value;
    this.user = {
      gender: { id: +formValues.gender! }, 
      role: { id: +formValues.role! },
      name: formValues.name!,
      first_surname: formValues.first_surname!,
      second_surname: formValues.second_surname!,
      code: this.userCode,
    };
    console.log(this.user);
  }
}
