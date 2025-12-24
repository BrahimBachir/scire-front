import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { CommonModule } from '@angular/common';

export interface ReviewDialogData {
  title: string;
}

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  imports: [MaterialModule, IconModule, FormsModule, CommonModule],
})
export class ReviewDialogComponent {
  public currentRating: number = 0;
  public reviewText: string = '';
  public maxStars: number[] = [1, 2, 3, 4, 5];

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
  ) {}

  /**
   * Sets the rating when a star is clicked.
   * @param rating The star value (1 to 5).
   */
  setRating(rating: number): void {
    this.currentRating = rating;
  }

  /**
   * Closes the dialog and returns the review data.
   */
  onConfirm(): void {
    this.dialogRef.close({
      rating: this.currentRating,
      reviewText: this.reviewText.trim(),
    });
  }

  /**
   * Closes the dialog without returning data.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}