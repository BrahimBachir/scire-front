import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding d-none d-lg-flex align-items-center text-decoratin-none">
      <a [routerLink]="['/']" class="d-flex">
        <img
          src="./assets/images/scire/scire-logo.png"
          class="align-middle m-2"
          alt="logo"
          width="30"
          height="30"
        />
        <span class="text-white m-l-15">
          Scire
        </span>
      </a>
    </div>
  `,
  styleUrl: 'branding.component.scss'
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}

  //        src="./assets/images/logos/light-logo.svg"