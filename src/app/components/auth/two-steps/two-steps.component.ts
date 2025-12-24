import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from '../../../material.module';
import { AppAuthBrandingComponent } from '../../generic/branding/auth-branding.component';

@Component({
  selector: 'app-two-steps',
  imports: [RouterModule, MaterialModule, AppAuthBrandingComponent],
  templateUrl: './two-steps.component.html',
})
export class AppTwoStepsComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
