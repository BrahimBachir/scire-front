import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

// Shown once, right after UserService.findLoggedUser() has already
// auto-downgraded the account to the free plan server-side — this dialog is
// purely informational plus an upsell, never a blocker on its own (the
// downgrade already happened; PlanGuard/PlanRedirectGuard already enforce it).
@Component({
  selector: 'app-voucher-expired-dialog',
  imports: [MatDialogActions, MatDialogTitle, MatDialogContent, MaterialModule],
  templateUrl: './voucher-expired-dialog.component.html',
})
export class AppVoucherExpiredDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AppVoucherExpiredDialogComponent>);
  readonly data: { previousPlanCode?: string } = inject(MAT_DIALOG_DATA);

  continueWithFree(): void {
    this.dialogRef.close('free');
  }
}
