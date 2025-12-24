import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { IUser } from 'src/app/common/models/interfaces';
import { AppState } from 'src/app/common/store/app.store';
import { selectLogedUser } from 'src/app/common/store/selectors';

@Component({
  selector: 'app-banner-level-up',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './banner-level-up.component.html',
})
export class AppBannersLevelUpComponent implements OnInit {
  logedUser = signal<IUser | null>(null);
  private store = inject(Store<AppState>);
  @Input() bannerText!: string;

  ngOnInit(): void {
    this.store.select(selectLogedUser).subscribe({
      next: (user) => this.logedUser.set(user)
    })
  }
}
