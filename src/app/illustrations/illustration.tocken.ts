import { InjectionToken } from '@angular/core';
import { TablerIllustration } from './illustration.interface';

export const ILLUSTRATIONS = new InjectionToken<TablerIllustration[]>(
  'ILLUSTRATIONS',
);
