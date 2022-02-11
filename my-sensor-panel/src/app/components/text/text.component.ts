import { Component, OnInit,Input, ViewChild, ElementRef ,ChangeDetectorRef} from '@angular/core';
import {CdkDragMove,CdkDragRelease ,DragRef,DragDrop, Point} from '@angular/cdk/drag-drop';
import { Coordinates } from "../../interfaces/Coordinates";
import { LocationsService } from 'src/app/services/locations.service';
import { DataService } from 'src/app/services/data.service';
import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})

export class TextComponent implements OnInit {
  @ViewChild('moveableText') TextComponent!:ElementRef
  @Input() color!:string
  @Input() id:any = null;
  @Input() sensor:any = null
  dataSubscription:Subscription = new Subscription();
  
    deltaX:number=0
    deltaY:number=0;
    value:any;
    units:any


  constructor(private cd: ChangeDetectorRef,public locationsService:LocationsService,private dragDropService: DragDrop, public dataService:DataService) { }

  ngOnInit(): void {
    this.value = ""
    this.units=""

    this.dataSubscription = this.dataService.finalData.asObservable().subscribe(x=>{
      if (this.sensor){
        this.value = x[this.sensor].value
      this.units = x[this.sensor].units
      this.update();
      }
    })
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

  update(){
    this.cd.detectChanges();
  }

  ngOnDestroy(){
    this.dataSubscription.unsubscribe()
  }

}
