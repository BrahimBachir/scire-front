import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { Store } from '@ngrx/store';
import { logoutAction } from 'src/app/common/store/actions';
import { AppState } from 'src/app/common/store/app.store';
import { createDefaultUser } from 'src/app/common/models/states';
import { IMenuOption, IUser } from 'src/app/common/models/interfaces';
import { Observable } from 'rxjs';
import { UserMenu } from 'src/app/common/config';
import { selectLogedIn, selectLogedUser } from 'src/app/common/store/selectors';
import { BrandingComponent } from '../branding/branding.component';

interface profiledd {
  id: number;
  title: string;
  link: string;
  new?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    BrandingComponent,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {

  user: IUser = createDefaultUser();
  logedIn$!: Observable<boolean | undefined>;
  logedUser$!: Observable<IUser | undefined>;
  userMenu: IMenuOption[] = UserMenu;
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  isCollapse: boolean = false; // Initially hidden

  toggleCollpase() {
    this.isCollapse = !this.isCollapse; // Toggle visibility
  }

  showFiller = false;

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-en.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/assets/images/flag/icon-flag-es.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/assets/images/flag/icon-flag-fr.svg',
    },
    {
      language: 'German',
      code: 'de',
      icon: '/assets/images/flag/icon-flag-de.svg',
    },
  ];

  @Output() optionsChange = new EventEmitter<AppSettings>();

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private store: Store<AppState>,
    private router: Router,
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.logedUser$ = this.store.select(selectLogedUser);
    this.logedIn$ = this.store.select(selectLogedIn);
  }

  goToLink(route: profiledd) {
    //if(route.title === 'FAQs') this.router.navigate([route.link]);

    const currentUrl = this.router.url;
    const baseRoleUrl = currentUrl.split('/')[1];
    this.router.navigate([baseRoleUrl,route.link]);
  }

  logout() {
    this.store.dispatch(logoutAction());
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  setlightDark(theme: string) {
    this.options.theme = theme;
    this.emitOptions();
  }

  private emitOptions() {
    this.optionsChange.emit(this.options);
  }

  profiledd: profiledd[] = [
    {
      id: 1,
      title: 'Mi perfil',
      link: 'profile',
    },
    {
      id: 2,
      title: 'Mis cursos',
      link: 'my-courses',
    },
    {
      id: 3,
      title: 'Cuenta',
      link: 'account',
    },    
    {
      id: 3,
      title: 'FAQs',
      link: 'faq',
    }
  ];
}
