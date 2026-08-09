import { Component, OnChanges, Input, Optional, Inject, SimpleChanges, effect } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { IllustrationRegistryService } from './illustrations.service';
import { ILLUSTRATIONS } from './illustration.tocken';
import { TablerIllustration } from './illustration.interface';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-illustration',
  template: `<div
    [innerHTML]="svgContent"
    class="illustration-container"
  ></div>`,
  styles: [
    `
      :host {
        display: inline-block; /* Allows the parent to treat it like a block/image */
        width: 100%; /* Default to filling parent width */
        height: auto;
      }
      .illustration-container,
      :host ::ng-deep svg {
        width: 100%;
        height: 100%;
        display: block;
      }
    `,
  ],
})
export class IllustrationComponent implements OnChanges {
  @Input() name!: string;
  /* @Input() theme: 'light' | 'dark' = 'light';
  currentTheme = this.themeService.theme;; */

  svgContent?: SafeHtml;

  constructor(
    private registry: IllustrationRegistryService,
    private sanitizer: DomSanitizer,
    @Optional()
    @Inject(ILLUSTRATIONS)
    private providedIcons: TablerIllustration[][],
    private themeService: ThemeService,
  ) {
    effect(() => {
      this.themeService.theme(); // Dependency tracking
      this.loadIllustration();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // 1. If new icons were provided via DI in this lazy route, sync them
    if (this.providedIcons) {
      this.registry.register(this.providedIcons.flat());
    }

    // 2. Re-load if name or theme changes
    if (changes['name'] || changes['theme']) {
      this.loadIllustration();
    }
  }

  private loadIllustration() {
    const theme = this.themeService.theme();
    const lookupName = theme === 'dark' ? `${this.name}-dark` : this.name;

    const content =
      this.registry.get(lookupName) || this.registry.get(this.name);

    if (content) {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(content);
    } else {
      this.svgContent = '';
    }
  }
}