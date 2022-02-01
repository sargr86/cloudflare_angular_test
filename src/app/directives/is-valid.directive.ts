import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[green]'
})
export class IsValidDirective {

  @HostBinding('class.active') isActive = false;
  @HostBinding('style.backgroundColor') bgColor = '';

  @HostListener('mouseover')
  mouseOver() {
    this.isActive = true;
    this.bgColor = 'blue';
    console.log('OK')
  }

  @HostListener('mouseout')
  mouseOut() {
    this.isActive = false;
    this.bgColor = '';
    console.log('OK')
  }

  constructor() {
  }

}
