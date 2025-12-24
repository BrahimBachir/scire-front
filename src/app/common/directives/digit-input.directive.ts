import { Directive, HostListener, Input, ElementRef, Self } from '@angular/core';
import { NgControl, FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[appDigitInput]',
})
export class DigitInputDirective {
  @Input() nextInput: HTMLInputElement | null | undefined;
  @Input() prevInput: HTMLInputElement | null | undefined;

  // Inject NgControl for access to the FormControl, and FormGroupDirective for the whole form
  constructor(
    private el: ElementRef,
    // Use @Self() to ensure we get the NgControl associated with this element
    @Self() private ngControl: NgControl,
    private formGroupDirective: FormGroupDirective 
  ) {}

  // ... (onKeyDown and onInput remain the same as the previous response) ...

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputEl = this.el.nativeElement as HTMLInputElement;

    // Allow control keys (backspace, delete, tab, escape, enter)
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }

    // Allow Ctrl/Cmd + A, C, X
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'x'].includes(event.key.toLowerCase())) {
        return;
    }
    
    // Check for Ctrl/Cmd + V (paste is handled separately below)
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
        return;
    }

    // If the input is already filled, prevent new characters
    if (inputEl.value.length === 1) {
      event.preventDefault();
      return;
    }

    // Restrict key press to a single digit
    const isDigit = /^[0-9]$/.test(event.key);

    if (!isDigit) {
      event.preventDefault();
    }
  }


  /**
   * 1. Handle pasting multiple characters and distributing them.
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Stop the default paste action

    const pasteData = event.clipboardData
      ?.getData('text')
      .trim()
      // Filter out non-numeric characters and get an array of digits
      .split('')
      .filter(char => /^[0-9]$/.test(char));
      
    if (!pasteData || pasteData.length === 0) {
      return;
    }

    // Get the name of the control where the paste occurred (e.g., 'one')
    const currentControlName = this.ngControl.name as string;
    const formControls = this.formGroupDirective.form.controls;
    
    // Get all control names in the order they were defined
    const controlNames = Object.keys(formControls);
    
    // Find the starting index for distribution
    const startIndex = controlNames.indexOf(currentControlName);
    
    let pasteIndex = 0;
    
    // Iterate from the current control onwards
    for (let i = startIndex; i < controlNames.length; i++) {
      const name = controlNames[i];
      const control = formControls[name];
      const digit = pasteData[pasteIndex];

      if (digit) {
        // Set the value of the form control
        control.setValue(digit);
        
        // Move to the next digit
        pasteIndex++;
      }
      
      // Stop if all pasted digits have been used
      if (pasteIndex >= pasteData.length) {
        // If it was the last control that received a digit, focus on the next one if it exists
        const nextControlName = controlNames[i + 1];
        if (nextControlName) {
            const nextElement = this.el.nativeElement.ownerDocument.querySelector(`[formControlName="${nextControlName}"]`) as HTMLInputElement;
            nextElement?.focus();
        } else {
             // If it was the last control overall, blur or submit
             this.el.nativeElement.blur();
        }
        break; 
      }
    }
    
    // Ensure the last control is focused if the paste filled all remaining fields
    if (pasteIndex === (controlNames.length - startIndex) && pasteIndex < pasteData.length) {
        // If the pasted length was exactly enough to fill the rest of the boxes, focus should move to the next field (if it existed) or blur
         this.el.nativeElement.blur(); // A safe default action
    }

  }

  @HostListener('input')
  onInput() {
    const inputEl: HTMLInputElement = this.el.nativeElement;

    // Move to the next box on input if filled
    if (inputEl.value.length === 1) {
      if (this.nextInput) {
        this.nextInput.focus();
      }
    }
  }

  @HostListener('keydown.backspace', ['$event'])
  onBackspace(event: Event) {
    const inputEl = this.el.nativeElement as HTMLInputElement;

    // If the current box is empty, move focus to the previous box and clear it
    if (!inputEl.value) {
      event.preventDefault();
      if (this.prevInput) {
        this.prevInput.focus();
        this.prevInput.value = ''; // Clear the previous box
        // Also trigger an input event on the previous control to update the form group
        this.prevInput.dispatchEvent(new Event('input'));
      }
    }
  }
}
/* import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDigitInput]',
})
export class DigitInputDirective {
  @Input() nextInput: HTMLInputElement | null | undefined;
  @Input() prevInput: HTMLInputElement | null | undefined;

  constructor(private el: ElementRef) {}


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputEl = this.el.nativeElement as HTMLInputElement;

    // Allow control keys (backspace, delete, tab, escape, enter)
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(event.key)) {
      return;
    }

    // Allow Ctrl/Cmd + A (select all), Ctrl/Cmd + V (paste, handled separately), Ctrl/Cmd + C (copy), Ctrl/Cmd + X (cut)
    if (
      (event.ctrlKey || event.metaKey) &&
      ['a', 'v', 'c', 'x'].includes(event.key.toLowerCase())
    ) {
      return;
    }

    // Allow arrow keys (left, right)
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }

    // Restrict key press to a single digit
    const isDigit = /^[0-9]$/.test(event.key);

    // If the input is already filled, prevent any new characters unless it's a control key
    if (inputEl.value.length === 1 && !['Backspace', 'Delete'].includes(event.key)) {
      event.preventDefault();
      return;
    }

    // If the key pressed is not a digit, prevent default
    if (!isDigit) {
      event.preventDefault();
    }
  }


  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Stop the default paste action

    const pasteData = event.clipboardData
      ?.getData('text')
      .trim()
      .split('');

    if (pasteData && pasteData.length > 0) {
      const firstDigit = pasteData[0];
      
      // Only paste the first character if it's a digit
      if (/^[0-9]$/.test(firstDigit)) {
        (this.el.nativeElement as HTMLInputElement).value = firstDigit;
        
        // Manually dispatch an 'input' event to trigger form control update and focus migration
        this.el.nativeElement.dispatchEvent(new Event('input'));
      }
    }
  }

  @HostListener('input')
  onInput() {
    const inputEl: HTMLInputElement = this.el.nativeElement;

    // Move to the next box on input if filled
    if (inputEl.value.length === 1) {
      if (this.nextInput) {
        this.nextInput.focus();
      }
    }
    // Note: If a user pastes more than one character, the onPaste logic
    // handles clipping it to one and then dispatches this 'input' event.
  }

  @HostListener('keydown.backspace', ['$event'])
  onBackspace(event: Event) {
    const inputEl = this.el.nativeElement as HTMLInputElement;

    // If the current box is empty, move focus to the previous box and clear it
    if (!inputEl.value) {
      event.preventDefault();
      if (this.prevInput) {
        this.prevInput.focus();
        this.prevInput.value = ''; // Clear the previous box
        // Also trigger an input event on the previous control to update the form group
        this.prevInput.dispatchEvent(new Event('input'));
      }
    }
  }
} */

/* // src/app/directives/digit-input.directive.ts
import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDigitInput]',
})
export class DigitInputDirective {
  // 💡 Add Input properties to accept the next and previous input elements
  @Input() nextInput: HTMLInputElement | null | undefined;;
  @Input() prevInput: HTMLInputElement | null | undefined;;

  constructor(private el: ElementRef) {}

  @HostListener('input')
  onInput() {
    const inputEl: HTMLInputElement = this.el.nativeElement;

    // 1. Move to the next box on input if filled
    if (inputEl.value.length === 1) {
      // Use the @Input property instead of nextElementSibling
      if (this.nextInput) {
        this.nextInput.focus();
      }
    }
    // 2. Handle a full paste (e.g., paste "123456" into the first box)
    // You might need more complex logic in the component to handle this,
    // but for now, we'll keep it focused on single digit entry.
  }

  @HostListener('keydown.backspace', ['$event'])
  onBackspace(event: Event) {
    const inputEl = this.el.nativeElement as HTMLInputElement;

    // If the current box is empty, move focus to the previous box
    if (!inputEl.value) {
      // Prevent the default backspace action from affecting the previous element's content
      event.preventDefault(); 
      if (this.prevInput) {
        this.prevInput.focus();
        // Clear the previous box's value when moving back
        this.prevInput.value = ''; 
      }
    }
  }
} */