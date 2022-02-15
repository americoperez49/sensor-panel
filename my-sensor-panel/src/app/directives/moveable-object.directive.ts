import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appMoveableObject]'
})
export class MoveableObjectDirective {

  @Input() id = "";
  elementToChange!: ElementRef;
    constructor(private el: ElementRef) {
      this.elementToChange = el
    }

    ngOnInit(){
      this.elementToChange.nativeElement.id=this.id
    }

}
