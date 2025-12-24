import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, Optional, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TablerIconsModule } from "angular-tabler-icons";
import { IReaction, DialogData } from "src/app/common/models/interfaces";
import { MaterialModule } from "src/app/material.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: 'app-feedback-dialog-content',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: 'feedback-dialog.component.html',
})
export class AppFeedbackDialogComponent implements OnInit {
  protected feedbackControl = new FormControl<string>('', { nonNullable: true });

  feedbackForm!: FormGroup;

  action: string | any;
  local_data: IReaction;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppFeedbackDialogComponent>,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.action = data.action;
    //this.local_data = { ...data.reaction };
  }
  ngOnInit(): void {
    this.feedbackForm = new FormGroup({
      feedback: new FormControl('')
    });    
  }

  saveFeedback(): void {
    const feedbackText = this.feedbackForm.get('feedback')?.value;
    this.dialogRef.close({ event: 'Refresh', feedback: feedbackText });
    this.openSnackBar('Gracias por ayudarnos a mejorar!', 'Close');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
