import {
  Component,
  HostBinding,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NavService } from 'src/app/services/nav.service';
import { ICourse } from 'src/app/common/models/interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { selectChoosenCourse } from 'src/app/common/store/selectors/learning.selectors';

@Component({
  selector: 'app-nav-item',
  imports: [TranslateModule, TablerIconsModule, MaterialModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ]
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  expanded: any = false;
  disabled: any = false;
  twoLines: any = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem | any;
  @Input() depth: any;
  route: string = '';
  selectedCourse!: ICourse | null;

  constructor(
    public navService: NavService,
    public router: Router,
    private store: Store<AppState>,
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    const url = this.navService.currentUrl();
    if (this.item.route && url) {
      this.expanded = url.indexOf(`/${this.item.route}`) === 0;
      this.ariaExpanded = this.expanded;
    }
    this.store.select(selectChoosenCourse).subscribe({
      next: (course) => {
        this.selectedCourse = course;
      }
    })
  }

  onItemSelected(item: NavItem) {
    if(item.disabled) return;
    this.createRoute(item)
    if (!item.children || !item.children.length) this.router.navigate([this.route]);
    if (item.children && item.children.length) this.expanded = !this.expanded;
    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (!this.expanded) {
      if (window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }

  onSubItemSelected(item: NavItem) {
    console.log(item)
    if (!item.children || !item.children.length) {
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }

  isDirectlyActive(item: NavItem): boolean {
    return !!item.route && this.router.isActive(item.route, true);
  }

  isChildActive(item: NavItem): boolean {
    if (!item.children) return false;
    return item.children.some(
      (child) => this.isDirectlyActive(child) || this.isChildActive(child)
    );
  }

  createRoute(item: NavItem) {
    const currentUrl = this.router.url;

    const baseRoleUrl = currentUrl.split('/')[1];
    if (item.type && item.type === 'GEN') this.route = `/${baseRoleUrl}/${item.route}`;
    else if (this.selectedCourse) this.route = `/${baseRoleUrl}/${item.route?.replace(':courseId', this.selectedCourse?.id.toString())}`;
  }

}
