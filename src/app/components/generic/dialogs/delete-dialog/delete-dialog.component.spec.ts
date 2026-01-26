import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDeleteDialogComponent } from './delete-dialog.component';

describe('AppDeleteDialogComponent', () => {
  let component: AppDeleteDialogComponent;
  let fixture: ComponentFixture<AppDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
