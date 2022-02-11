import { CdkDragMove, CdkDragRelease, DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Coordinates } from 'src/app/interfaces/Coordinates';
import { LocationsService } from 'src/app/services/locations.service';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit {
  @ViewChild('moveableGauge') TextComponent!:ElementRef

  deltaX:number=0
  deltaY:number=0;
  @Input() id:any = null;

  constructor(public locationsService:LocationsService,private dragDropService: DragDrop) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    let dragRef:DragRef = this.dragDropService.createDrag(this.TextComponent);
    if (this.locationsService.locations[this.id]){
      dragRef.setFreeDragPosition(this.locationsService.locations[this.id])
    } 
    else {
      dragRef.setFreeDragPosition({x:0,y:0})
    }
  }

  released($event:CdkDragRelease){
    var originalCoordinates:Coordinates;
    var finalCoordinates: Coordinates

    originalCoordinates= this.locationsService.locations[this.id] // returns { x: 0, y: 0 }
    if (originalCoordinates == null) originalCoordinates = {x:0,y:0}
    finalCoordinates  = JSON.parse(JSON.stringify(originalCoordinates))
    finalCoordinates.x += this.deltaX
    finalCoordinates.y += this.deltaY
    console.log(`> Position X: ${finalCoordinates.x} - Y: ${finalCoordinates.y}`)
   
    if ($event.source.element.nativeElement.parentElement?.id){
      this.locationsService.updateLocations($event.source.element.nativeElement.parentElement.id,finalCoordinates)
    }
    else{
      console.log("You need to add an Id to this component")
    }
   
  }

  moved($event: CdkDragMove) {
    this.deltaX = $event.distance.x
    this.deltaY = $event.distance.y
    // console.log($event.distance)
  }

}
