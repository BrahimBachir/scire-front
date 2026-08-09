import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-countdown-timer',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './countdown-timer.html',
  styleUrl: './countdown-timer.scss'
})
export class CountdownTimer  implements OnDestroy, OnInit /*, OnChanges*/ { // Implement OnInit
  @Input() initialMinutes: number = 0;
  @Input() initialSeconds: number = 0;
  @Input() public timerRunning: boolean = false;
  @Output() timerStarted = new EventEmitter<void>();
  @Output() timerPaused = new EventEmitter<void>();
  @Output() timerReset = new EventEmitter<void>();
  @Output() timerCompleted = new EventEmitter<void>(); // Emit when timer reaches 0


  // Current time remaining
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  // Input for setting minutes (can still be used for manual override if desired)
  inputMinutes: number = 0;

  // Timer properties
  private timer: any;
  totalSeconds: number = 0; // Total seconds for the countdown

  showCompletionMessage: boolean = false; // To show the "Time's up!" message

  // Fixed reference point `getConsumedTime()` measures against. Captured once
  // (not re-read from `initialSeconds`, which keeps shrinking as the parent
  // persists the remaining time back into this same bound input).
  private anchorSeconds: number = 0;

  /**
   * OnInit lifecycle hook.
   * Initializes the timer with the `initialMinutes` input if provided.
   */
  ngOnInit(): void {
    const secondsToSet = Number(this.initialSeconds);

    if (!isNaN(secondsToSet) && secondsToSet >= 0) {
      this.inputMinutes = secondsToSet / 60;
      this.totalSeconds = secondsToSet;
      this.anchorSeconds = secondsToSet;
      this.updateDisplayTime(); // Update display immediately
    }
  }

  /**
   * Starts the countdown timer.
   * Calculates total seconds from inputMinutes and begins decrementing.
   */
  startTimer(): void {
    if (this.timerRunning) {
      return;
    }
    const secondsToSet = Number(this.initialSeconds);

    if (this.totalSeconds === 0 && secondsToSet > 0) {
      this.totalSeconds = secondsToSet;
      this.anchorSeconds = secondsToSet;
    }


    this.timerRunning = true;
    this.showCompletionMessage = false; // Hide completion message if starting again

    this.timer = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        this.updateDisplayTime();
      } else {
        this.stopTimer(); // Stop when countdown reaches zero
        this.timerCompleted.emit();
        this.showCompletionMessage = true; // Show "Time's up!"
      }
    }, 1000); // Update every second
  }

  /**
   * Pauses the countdown timer.
   */
  pauseTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timerRunning = false;
    }
  }

  /**
   * Resets the countdown timer to its initial state.
   */
  resetTimer(): void {
    this.stopTimer(); // Ensure timer is stopped
    // When resetting, use the initialMinutes if available, otherwise default to 0
    const resetToMinutes = Number(this.initialMinutes);
    if (!isNaN(resetToMinutes) && resetToMinutes >= 0) {
      this.totalSeconds = resetToMinutes * 60;
      this.inputMinutes = resetToMinutes;
    } else {
      this.totalSeconds = 0;
      this.inputMinutes = 0;
    }

    this.updateDisplayTime(); // Update display based on reset value
    this.timerRunning = false;
    this.showCompletionMessage = false; // Hide completion message on reset
  }

  /**
   * Stops the internal timer interval.
   */
  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public get isTimerRunning(): boolean {
    return this.timerRunning;
  }

  /**
   * Updates the `minutes` and `seconds` properties based on `totalSeconds`.
   */
  private updateDisplayTime(): void {
    this.hours = Math.floor(this.totalSeconds / 60 / 60);
    this.minutes = Math.floor((this.totalSeconds / 60) % 60);
    this.seconds = this.totalSeconds % 60;
  }

  /**
   * Lifecycle hook: Cleans up the timer when the component is destroyed
   * to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.stopTimer();
  }

  getElapsedTime(): string {
    const elapsedSeconds = this.initialMinutes * 60 - this.totalSeconds;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const remainingSeconds = elapsedSeconds % 60;
    return `${this.padZero(elapsedMinutes)}:${this.padZero(remainingSeconds)}`;
  }

  getConsumedTime(): number {
    return this.anchorSeconds - this.totalSeconds;
  }

  /**
   * Hard-resets the countdown to a given remaining-time value (e.g. after the
   * backing test attempt is reset) and rebases the consumed-time anchor to it.
   */
  setRemainingSeconds(seconds: number): void {
    this.stopTimer();
    this.totalSeconds = seconds;
    this.anchorSeconds = seconds;
    this.timerRunning = false;
    this.showCompletionMessage = false;
    this.updateDisplayTime();
  }

  /**
   * Pads a number with a leading zero if it is less than 10.
   * @param num The number to pad.
   * @returns A string representation of the number, padded with a leading zero if necessary.
   */
  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
