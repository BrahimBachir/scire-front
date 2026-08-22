import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';

@Component({
  selector: 'app-organizations-placeholder',
  imports: [TranslateModule, AppBannersNotFoundComponent],
  templateUrl: './organizations-placeholder.component.html',
})
export class AppOrganizationsPlaceholderComponent {}
