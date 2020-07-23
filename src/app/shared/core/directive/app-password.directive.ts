import { Directive, ElementRef } from '@angular/core';
@Directive({
  selector: '[appPassword]'
})
export class AppPasswordDirective {
  private _shown = false;
  constructor(private el: ElementRef) {
    this.setup();
  }
  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<a href="javascript:void(0)"><abbr title="Hide"><i class="icon-Vector-4"></i></abbr><a>';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = '<a href="javascript:void(0)"><abbr title="Show"><i class="icon-Vector-2"></i></abbr><a>';
    }
  }
  setup() {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.innerHTML = `<a href="javascript:void(0)"><abbr title="Show"><i class="icon-Vector-2"></i></abbr><a>`;
    span.className = 'spanai';
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }
}