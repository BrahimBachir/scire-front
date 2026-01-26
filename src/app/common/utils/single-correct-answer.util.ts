import { AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

export function singleCorrectAnswerValidator(
  control: AbstractControl
): ValidationErrors | null {
  const answers = control as FormArray;

  const correctCount = answers.controls.filter(
    c => c.get('isCorrect')?.value === true
  ).length;

  return correctCount === 1
    ? null
    : { singleCorrectAnswer: true };
}
