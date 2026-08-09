import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  isDevMode,
  LOCALE_ID,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ToastrModule } from 'ngx-toastr';
import { provideToastr } from 'ngx-toastr';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxPermissionsModule } from 'ngx-permissions';
//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// code view
import { provideHighlightOptions } from 'ngx-highlightjs';
import 'highlight.js/styles/atom-one-dark.min.css';
import { metaReducers, ROOT_REDUCERS } from './common/store/app.store';
import { AuthEffects, UsersEffects } from './common/store/effects';
import { provideEffects } from '@ngrx/effects';
import { ResponseInterceptor } from './common/interceptors/error.interceptor';
import { HeadersInterceptor } from './common/interceptors/jwt.interceptor';
import { LearningEffects } from './common/store/effects/learning.effects';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SPANISH_DATE_FORMATS } from './common/config/constants';
import { MyPaginatorIntl } from './services';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { dateInterceptor, refreshInterceptor } from './common/interceptors';
import { provideAppIllustrations } from './illustrations/providers/illustrations-app.provider';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(), // required animations providers
    provideAppIllustrations(),
    provideToastr(), // Toastr providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
      languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml'),
      },
    }),
    provideStore(ROOT_REDUCERS, { metaReducers }),
    provideEffects([ AuthEffects, UsersEffects, LearningEffects]),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(
      withInterceptors([dateInterceptor, refreshInterceptor])
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    importProvidersFrom(
      FormsModule,
      ToastrModule.forRoot(),
      ReactiveFormsModule,
      MaterialModule,
      NgxPermissionsModule.forRoot(),
      NgScrollbarModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    { provide: MatPaginatorIntl, useClass: MyPaginatorIntl },
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    { provide: MAT_DATE_FORMATS, useValue: SPANISH_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
};
