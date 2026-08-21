import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Opóstata!';

  constructor(private languageService: LanguageService) {}
}
