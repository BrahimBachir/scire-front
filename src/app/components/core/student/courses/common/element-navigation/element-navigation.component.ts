import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-element-navigation',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    IconModule,
  ],
  templateUrl: './element-navigation.component.html',
  styleUrl: './element-navigation.component.scss'
})
export class AppElementNavigationComponent {
  @Output() direction: EventEmitter<string> = new EventEmitter<string>();

  getNext() {
    this.direction.emit('FORWARD');
  }

  getPrevious() {
    this.direction.emit('BACKWARD');
  }

  @Input() canGoNext: boolean | null = false;
  @Input() canGoPrevious: boolean | null = false;

  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  onNext() {
    if (this.canGoNext) {
      this.next.emit();
    }
  }

  onPrevious() {
    if (this.canGoPrevious) {
      this.previous.emit();
    }
  }
}
