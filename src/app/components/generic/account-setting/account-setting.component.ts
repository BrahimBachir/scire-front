import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AppState } from 'src/app/common/store/app.store';
import { selectLogedUser, selectUserActivePlan, selectUserRole } from 'src/app/common/store/selectors';
import { loadLogedUser, changeUserPlan, resetUserPlan, startCheckout, checkoutSessionFailed, changeUserRole, changeUserRoleFailed } from 'src/app/common/store/actions';
import { IPlan, IPlanFeatures, IRole, ISession, IUser } from 'src/app/common/models/interfaces';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService, RoleService, UsersService } from 'src/app/services';
import { Roles } from 'src/app/common/enums/roles.enum';
import { CountryFilterComponent } from 'src/app/components/generic/filters/country/country-filter.component';
import { TownFilterComponent } from 'src/app/components/generic/filters/town/town-filter.component';

// Mirrors the backend rule in UserService.changeRole()'s ROLE_CHANGE_MATRIX:
// only SUPER may ever end up SUPER. UX only — the backend re-checks this
// against a fresh DB read regardless of what this list offers.
const ROLE_CHANGE_MATRIX: Partial<Record<string, string[]>> = {
  [Roles.SUPER]: [Roles.SUPER, Roles.ADMIN, Roles.STUDENT, Roles.INSTRUCTOR, Roles.USER],
  [Roles.ADMIN]: [Roles.ADMIN, Roles.STUDENT, Roles.INSTRUCTOR, Roles.USER],
  [Roles.INSTRUCTOR]: [Roles.STUDENT],
  [Roles.STUDENT]: [Roles.INSTRUCTOR],
};

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, IconModule, CountryFilterComponent, TownFilterComponent],
  templateUrl: './account-setting.component.html'
})
export class AppAccountSettingComponent implements OnInit {
  private store = inject(Store<AppState>);
  private configService = inject(ConfigService);
  private roleService = inject(RoleService);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private actions$ = inject(Actions);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  activePlan$ = this.store.select(selectUserActivePlan);
  availablePlans = signal<IPlan[]>([]);
  selectedPlanCode = signal<string | null>(null);

  allRoles = signal<IRole[]>([]);
  currentRoleCode = signal<string | null>(null);
  selectedRoleCode = signal<string | null>(null);

  // ---- Avatar ----
  loggedUser = signal<IUser | null>(null);
  uploadingAvatar = signal(false);

  // ---- Change password ----
  passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[a-zA-Z])(?=.*[0-9])/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatch },
  );
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);
  changingPassword = signal(false);

  // ---- Personal details ----
  savingPersonal = signal(false);

  // ---- Security: two-factor + devices ----
  twoFactorEnabled = signal(false);
  togglingTwoFactor = signal(false);
  sessions = signal<ISession[]>([]);

  // ---- Billing address ----
  useDifferentBillingAddress = signal(false);
  savingBilling = signal(false);

  billingForm = new FormGroup({
    countryId: new FormControl<number | null>(null, [Validators.required]),
    townId: new FormControl<number | null>(null, [Validators.required]),
    street: new FormControl('', [Validators.required]),
    number: new FormControl<number | null>(null, [Validators.required]),
    postal_code: new FormControl('', [Validators.required]),
    other_info: new FormControl(''),
  });

  // ---- Notification preferences ----
  savingNotifications = signal(false);

  notificationsForm = new FormGroup({
    notificationEmail: new FormControl('', [Validators.email]),
    newsletterOptIn: new FormControl(false),
    courseUpdatesOptIn: new FormControl(true),
    lawUpdatesOptIn: new FormControl(true),
    instructorPublicationsOptIn: new FormControl(true),
  });

  personalForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    first_surname: new FormControl('', [Validators.required]),
    second_surname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    countryId: new FormControl<number | null>(null),
    townId: new FormControl<number | null>(null),
    street: new FormControl(''),
    number: new FormControl<number | null>(null),
    postal_code: new FormControl(''),
    other_info: new FormControl(''),
  });

  ngOnInit(): void {
    this.configService.getPlanes().subscribe({
      next: (planes) => this.availablePlans.set(planes),
    });

    this.roleService.getAll().subscribe({
      next: (roles) => this.allRoles.set(roles),
    });

    this.store.select(selectUserRole).subscribe(role => this.currentRoleCode.set(role?.code ?? null));

    this.store.select(selectLogedUser).subscribe((user) => {
      if (!user) return;
      this.loggedUser.set(user);
      this.populatePersonalForm(user);
    });

    this.usersService.getNotificationPreferences().subscribe({
      next: (prefs) => this.notificationsForm.patchValue(prefs),
    });

    this.authService.getMyLogin().subscribe({
      next: (login) => this.twoFactorEnabled.set(login.twoFactorEnabled),
    });

    this.authService.getSessions().subscribe({
      next: (sessions) => this.sessions.set(sessions),
    });

    this.usersService.getBillingAddress().subscribe({
      next: (address) => {
        if (!address || !address.type || address.type.code !== 'TADD') return;
        this.useDifferentBillingAddress.set(true);
        this.billingForm.patchValue({
          countryId: address.country?.id ?? null,
          townId: address.town?.id ?? null,
          street: address.street,
          number: address.number,
          postal_code: address.postal_code,
          other_info: address.other_info,
        });
      },
    });

    this.actions$.pipe(ofType(checkoutSessionFailed)).subscribe(() => {
      this.snackBar.open('No se ha podido iniciar el pago. Inténtalo de nuevo.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });

    this.actions$.pipe(ofType(changeUserRoleFailed)).subscribe(() => {
      this.snackBar.open('No se ha podido cambiar el rol.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.selectedRoleCode.set(null);
    });
  }

  private populatePersonalForm(user: IUser): void {
    const defaultEmail = user.emails?.find((e) => e.by_default) ?? user.emails?.[0];
    const defaultPhone = user.phones?.find((p) => p.by_default) ?? user.phones?.[0];
    const defaultAddress = user.addresses?.find((a) => a.by_default) ?? user.addresses?.[0];

    this.personalForm.patchValue({
      name: user.name ?? '',
      first_surname: user.first_surname ?? '',
      second_surname: user.second_surname ?? '',
      email: defaultEmail?.value ?? '',
      phone: defaultPhone?.number ?? '',
      countryId: defaultAddress?.country?.id ?? null,
      townId: defaultAddress?.town?.id ?? null,
      street: defaultAddress?.street ?? '',
      number: defaultAddress?.number ?? null,
      postal_code: defaultAddress?.postal_code ?? '',
      other_info: defaultAddress?.other_info ?? '',
    });
  }

  private notify(messageKey: string): void {
    this.snackBar.open(this.translate.instant(messageKey), this.translate.instant('BUTTONS.CLOSE'), {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // ---- Avatar ----

  onAvatarFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > MAX_AVATAR_SIZE_BYTES) {
      this.notify('ERRORS.VALIDATION.AVATAR');
      return;
    }

    this.uploadingAvatar.set(true);
    this.usersService.uploadAvatar(file).subscribe({
      next: () => {
        this.uploadingAvatar.set(false);
        this.store.dispatch(loadLogedUser());
        this.notify('SUCCESS.AVATAR_UPDATED');
      },
      error: () => this.uploadingAvatar.set(false),
    });
  }

  resetAvatar(): void {
    this.uploadingAvatar.set(true);
    this.usersService.resetAvatar().subscribe({
      next: () => {
        this.uploadingAvatar.set(false);
        this.store.dispatch(loadLogedUser());
        this.notify('SUCCESS.AVATAR_RESET');
      },
      error: () => this.uploadingAvatar.set(false),
    });
  }

  // ---- Change password ----

  get pf() {
    return this.passwordForm.controls;
  }

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword.update((v) => !v);
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.changingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.authService.changePassword(currentPassword ?? '', newPassword ?? '').subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.passwordForm.reset();
        this.notify('SUCCESS.PASSWORD_CHANGED');
      },
      error: () => this.changingPassword.set(false),
    });
  }

  // ---- Personal details ----

  savePersonalDetails(): void {
    if (this.personalForm.invalid) return;

    const userId = this.loggedUser()?.id;
    if (!userId) return;

    this.savingPersonal.set(true);
    const raw = this.personalForm.getRawValue();

    const requests = [
      this.usersService.updateUser({
        id: userId,
        name: raw.name,
        first_surname: raw.first_surname,
        second_surname: raw.second_surname,
      }),
      this.usersService.updateEmail(raw.email ?? ''),
    ];

    if (raw.phone) requests.push(this.usersService.updatePhone(raw.phone));

    if (raw.countryId && raw.townId && raw.street && raw.postal_code && raw.number) {
      requests.push(
        this.usersService.updateAddress({
          countryId: raw.countryId,
          townId: raw.townId,
          street: raw.street,
          number: raw.number,
          postal_code: raw.postal_code,
          other_info: raw.other_info ?? undefined,
        }),
      );
    }

    Promise.all(requests.map((r) => firstValueFrom(r)))
      .then(() => {
        this.savingPersonal.set(false);
        this.store.dispatch(loadLogedUser());
        this.notify('SUCCESS.PROFILE_UPDATED');
      })
      .catch(() => this.savingPersonal.set(false));
  }

  toggleTwoFactor(enabled: boolean): void {
    this.togglingTwoFactor.set(true);
    this.authService.toggleTwoFactor(enabled).subscribe({
      next: () => {
        this.togglingTwoFactor.set(false);
        this.twoFactorEnabled.set(enabled);
      },
      error: () => this.togglingTwoFactor.set(false),
    });
  }

  revokeSession(familyId: string): void {
    this.authService.revokeSession(familyId).subscribe({
      next: () => this.sessions.update((current) => current.filter((s) => s.familyId !== familyId)),
    });
  }

  revokeOtherSessions(): void {
    this.authService.revokeOtherSessions().subscribe({
      next: () => this.sessions.update((current) => current.filter((s) => s.isCurrent)),
    });
  }

  onBillingModeChange(useDifferent: boolean): void {
    this.useDifferentBillingAddress.set(useDifferent);
    if (!useDifferent) {
      this.usersService.deleteBillingAddress().subscribe();
      this.billingForm.reset();
    }
  }

  saveBillingAddress(): void {
    if (this.billingForm.invalid) return;

    this.savingBilling.set(true);
    const raw = this.billingForm.getRawValue();
    this.usersService
      .upsertBillingAddress({
        countryId: raw.countryId!,
        townId: raw.townId!,
        street: raw.street ?? '',
        number: raw.number!,
        postal_code: raw.postal_code ?? '',
        other_info: raw.other_info ?? undefined,
      })
      .subscribe({
        next: () => {
          this.savingBilling.set(false);
          this.notify('SUCCESS.PROFILE_UPDATED');
        },
        error: () => this.savingBilling.set(false),
      });
  }

  saveNotificationPreferences(): void {
    if (this.notificationsForm.invalid) return;

    this.savingNotifications.set(true);
    const raw = this.notificationsForm.getRawValue();
    this.usersService.updateNotificationPreferences({
      notificationEmail: raw.notificationEmail || null,
      newsletterOptIn: !!raw.newsletterOptIn,
      courseUpdatesOptIn: !!raw.courseUpdatesOptIn,
      lawUpdatesOptIn: !!raw.lawUpdatesOptIn,
      instructorPublicationsOptIn: !!raw.instructorPublicationsOptIn,
    }).subscribe({
      next: (prefs) => {
        this.savingNotifications.set(false);
        this.notificationsForm.patchValue(prefs);
        this.notify('SUCCESS.PROFILE_UPDATED');
      },
      error: () => this.savingNotifications.set(false),
    });
  }

  get assignableRoles(): IRole[] {
    const allowed = this.currentRoleCode() ? ROLE_CHANGE_MATRIX[this.currentRoleCode()!] : undefined;
    if (!allowed) return [];
    return this.allRoles().filter(r => !!r.code && r.code !== this.currentRoleCode() && allowed.includes(r.code));
  }

  onRoleSelected(roleCode: string): void {
    this.selectedRoleCode.set(roleCode);
  }

  changeRole(): void {
    const roleCode = this.selectedRoleCode();
    if (!roleCode) return;
    this.store.dispatch(changeUserRole({ roleCode }));
    this.selectedRoleCode.set(null);
  }

  onPlanSelected(planCode: string): void {
    this.selectedPlanCode.set(planCode);
  }

  getPlanFeatures(planCode: string): IPlanFeatures[] {
    return this.availablePlans().find((plan) => plan.code === planCode)?.plan_features ?? [];
  }

  changePlan(): void {
    const planCode = this.selectedPlanCode();
    if (!planCode) return;

    const plan = this.availablePlans().find((p) => p.code === planCode);
    if (plan && Number(plan.price) > 0) {
      // Paid plans go through Stripe Checkout instead of the free-only change-plan endpoint.
      this.store.dispatch(startCheckout({ planCode, interval: 'month' }));
    } else {
      this.store.dispatch(changeUserPlan({ planCode }));
    }

    this.selectedPlanCode.set(null);
  }

  resetPlan(): void {
    this.store.dispatch(resetUserPlan());
  }
}
