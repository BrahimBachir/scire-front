import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGenericElementDialogComponent } from './create-generic-element-dialog.component';

describe('CreateGenericElementDialogComponent', () => {
  let component: CreateGenericElementDialogComponent;
  let fixture: ComponentFixture<CreateGenericElementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGenericElementDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGenericElementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
