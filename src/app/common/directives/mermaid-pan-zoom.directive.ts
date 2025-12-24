import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[mermaidPanZoom]',
  standalone: true
})
export class MermaidPanZoomDirective {

  @Input() minZoom = 0.4;
  @Input() maxZoom = 3;

  private zoom = 1;
  private dragging = false;
  private startX = 0;
  private startY = 0;
  private tx = 0;
  private ty = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.setStyle(el.nativeElement, 'cursor', 'grab');
  }

  @HostListener('mousedown', ['$event'])
  onDown(e: MouseEvent) {
    this.dragging = true;
    this.startX = e.clientX - this.tx;
    this.startY = e.clientY - this.ty;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent) {
    if (!this.dragging) return;
    this.tx = e.clientX - this.startX;
    this.ty = e.clientY - this.startY;
    this.applyTransform();
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onUp() {
    this.dragging = false;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
  }

  zoomIn() {
    this.zoom = Math.min(this.zoom + 0.2, this.maxZoom);
    this.applyTransform();
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom - 0.2, this.minZoom);
    this.applyTransform();
  }

  reset() {
    this.zoom = 1;
    this.tx = this.ty = 0;
    this.applyTransform();
  }

  private applyTransform() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `translate(${this.tx}px, ${this.ty}px) scale(${this.zoom})`
    );
  }
}
