// password-info.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-pass-info',
  template: `
    <div class="tooltip-container">
      ✔ Mínimo 8 caracteres <br>
      ✔ Al menos una mayúscula <br>
      ✔ Al menos una minúscula <br>
      ✔ Al menos un número <br>
      ✔ Al menos un símbolo <br>
      ✔ Sin espacios
    </div>
  `,
  styles: [`
    .tooltip-container {
      font-size: 13px;
      padding: 10px;
      max-width: 220px;
      line-height: 1.4;
    }
  `]
})
export class PassInfoComponent {}
