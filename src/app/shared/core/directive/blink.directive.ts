import { Directive, OnChanges, Input, SimpleChanges,ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges {

  @Input() public size: any;
  @Input() public bet_status: any;

  constructor(private elementRef: ElementRef){

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.size && changes.size.currentValue != changes.size.previousValue) {
      //console.log('value', changes.size.currentValue);
      this.elementRef.nativeElement.style.backgroundColor='#ffffd0';
      setTimeout(()=>{
        if(this.bet_status=='back')
          this.elementRef.nativeElement.style.backgroundColor='#a7d8fd';
        else
          this.elementRef.nativeElement.style.backgroundColor='#f9c9d4';
      },250)
    }
  } 
}