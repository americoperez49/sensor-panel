import { Directive,ElementRef,Input } from '@angular/core';

@Directive({
  selector: '[appFontstyle]'
})
export class FontStyleDirective {

  @Input() color = "";
  @Input() fontFamily = "";
  @Input() fontSize = "";
  @Input() id = "";
  elementToChange!: ElementRef;
    constructor(private el: ElementRef) {
      this.elementToChange = el
    }

    ngOnInit(){
      this.elementToChange.nativeElement.style.color = this.color;
      this.elementToChange.nativeElement.style.fontSize = this.fontSize;
      this.elementToChange.nativeElement.style.fontFamily = this.fontFamily
      this.elementToChange.nativeElement.id=this.id
    }

}
