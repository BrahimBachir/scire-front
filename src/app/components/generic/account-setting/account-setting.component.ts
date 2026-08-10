import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';
import { IconModule } from 'src/app/icon/icon.module';
import { AppState } from 'src/app/common/store/app.store';
import { selectUserActivePlan } from 'src/app/common/store/selectors';
import { changeUserPlan, resetUserPlan, startCheckout, checkoutSessionFailed } from 'src/app/common/store/actions';
import { IPlan, IPlanFeatures } from 'src/app/common/models/interfaces';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, MatCardModule, MatIconModule, IconModule, MatTabsModule, MatFormFieldModule,
    MatSlideToggleModule, MatSelectModule, MatInputModule, MatButtonModule, MatDividerModule, MatExpansionModule],
  templateUrl: './account-setting.component.html'
})
export class AppAccountSettingComponent implements OnInit {
  private store = inject(Store<AppState>);
  private configService = inject(ConfigService);
  private actions$ = inject(Actions);
  private snackBar = inject(MatSnackBar);

  activePlan$ = this.store.select(selectUserActivePlan);
  availablePlans = signal<IPlan[]>([]);
  selectedPlanCode = signal<string | null>(null);

  ngOnInit(): void {
    this.configService.getPlanes().subscribe({
      next: (planes) => this.availablePlans.set(planes),
    });

    this.actions$.pipe(ofType(checkoutSessionFailed)).subscribe(() => {
      this.snackBar.open('No se ha podido iniciar el pago. Inténtalo de nuevo.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
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
