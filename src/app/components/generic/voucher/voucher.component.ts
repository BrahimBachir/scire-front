import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/common/store/app.store';
import {
  requestVoucher,
  voucherRequested,
  voucherRequestFailed,
  redeemVoucher,
  voucherRedeemed,
  voucherRedeemFailed,
  startSetupCheckout,
  setupSessionFailed,
} from 'src/app/common/store/actions';
import { selectPendingPlanCode } from 'src/app/common/store/selectors';
import { IPlan } from 'src/app/common/models/interfaces';
import { ConfigService } from 'src/app/services/config.service';
import { VouchersService, IVoucherEligibility } from 'src/app/services';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-voucher',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    IconModule,
  ],
  templateUrl: './voucher.component.html',
})
export class AppVoucherComponent implements OnInit {
  private store = inject(Store<AppState>);
  private actions$ = inject(Actions);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  protected planes = signal<IPlan[]>([]);
  protected eligibility = signal<IVoucherEligibility | null>(null);
  protected requesting = signal(false);
  protected redeeming = signal(false);
  protected redeemed = signal<{ planCode: string; grantedUntil: string } | null>(null);

  pendingPlanCode$ = this.store.select(selectPendingPlanCode);

  planControl = new FormControl<string>('', [Validators.required]);
  codeControl = new FormControl<string>('', [Validators.required]);

  constructor(
    private configService: ConfigService,
    private vouchersService: VouchersService,
  ) {}

  ngOnInit(): void {
    this.configService.getPlanes().subscribe({
      next: (planes: IPlan[]) => {
        const eligiblePlanes = planes.filter((p) => Number(p.price) > 0);
        this.planes.set(eligiblePlanes);

        this.pendingPlanCode$.subscribe((pendingPlanCode) => {
          if (pendingPlanCode) this.planControl.setValue(pendingPlanCode);
          else if (eligiblePlanes[0]) this.planControl.setValue(eligiblePlanes[0].code);
        });
      },
    });

    this.refreshEligibility();

    this.route.queryParams.subscribe((params) => {
      if (params['code']) this.codeControl.setValue(params['code']);
      if (params['setup'] === 'success') {
        this.showSnackbar('Tarjeta guardada correctamente.');
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      } else if (params['setup'] === 'cancelled') {
        this.showSnackbar('No se ha guardado ninguna tarjeta.');
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });

    this.actions$.pipe(ofType(voucherRequested)).subscribe(({ warning }) => {
      this.requesting.set(false);
      this.refreshEligibility();
      this.showSnackbar(
        warning
          ? 'Código reservado, pero no hemos podido enviarte el email. Contacta con soporte.'
          : '¡Código enviado! Revisa tu correo.',
      );
    });

    this.actions$.pipe(ofType(voucherRequestFailed)).subscribe(() => {
      this.requesting.set(false);
      this.showSnackbar('No se ha podido generar el código. Inténtalo de nuevo.');
    });

    this.actions$.pipe(ofType(voucherRedeemed)).subscribe(({ planCode, grantedUntil }) => {
      this.redeeming.set(false);
      this.redeemed.set({ planCode, grantedUntil });
      this.showSnackbar(`¡Código canjeado! Tienes acceso a ${planCode} hasta el ${new Date(grantedUntil).toLocaleDateString('es-ES')}.`);
    });

    this.actions$.pipe(ofType(voucherRedeemFailed)).subscribe(() => {
      this.redeeming.set(false);
      this.showSnackbar('Código no válido o ya utilizado.');
    });

    this.actions$.pipe(ofType(setupSessionFailed)).subscribe(() => {
      this.showSnackbar('No se ha podido iniciar el guardado de la tarjeta. Inténtalo de nuevo.');
    });
  }

  private refreshEligibility(): void {
    this.vouchersService.getEligibility().subscribe({
      next: (eligibility) => this.eligibility.set(eligibility),
    });
  }

  requestCode(): void {
    if (!this.planControl.valid) return;
    this.requesting.set(true);
    this.store.dispatch(requestVoucher({ planCode: this.planControl.value! }));
  }

  redeemCode(): void {
    if (!this.codeControl.valid) return;
    this.redeeming.set(true);
    this.store.dispatch(redeemVoucher({ code: this.codeControl.value! }));
  }

  saveCard(): void {
    const planCode = this.redeemed()?.planCode || this.planControl.value;
    if (!planCode) return;
    this.store.dispatch(startSetupCheckout({ planCode }));
  }

  goToPricing(): void {
    this.router.navigate(['/student/pricing']);
  }

  continueWithFree(): void {
    this.router.navigate(['/']);
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
