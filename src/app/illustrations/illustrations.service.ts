import { Injectable, Optional, Inject } from '@angular/core';
import { TablerIllustration } from './illustration.interface';

@Injectable({ providedIn: 'root' })
export class IllustrationRegistryService {
  private registry = new Map<string, string>();

  public register(illustrations: TablerIllustration[]): void {
    illustrations.forEach((ill) => {
      if (!this.registry.has(ill.name)) {
        this.registry.set(ill.name, ill.data);
      }
    });
  }

  public get(name: string): string | undefined {
    return this.registry.get(name);
  }
}