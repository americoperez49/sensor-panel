import { CdkDragMove, CdkDragRelease, DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Coordinates } from 'src/app/interfaces/Coordinates';
import { DataService } from 'src/app/services/data.service';
import { LocationsService } from 'src/app/services/locations.service';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit {
  @ViewChild('moveableGauge') GaugeComponent!:ElementRef
  @Input() id:any = null;
  @Input() sensor:any = null
  @Input() images:any = null
  @Input() min:any = null
  @Input() max:any = null

  dataSubscription:Subscription = new Subscription();
  imageSubscription:Subscription = new Subscription();
  
    deltaX:number=0
    deltaY:number=0;
    value:any;
    src:any;
    listOfImages:any


  constructor(private cd: ChangeDetectorRef,public locationsService:LocationsService,private dragDropService: DragDrop, public dataService:DataService, private httpClient:HttpClient) { }

  ngOnInit(): void {
    this.value = ""
    this.max = Number(this.max)
    this.min = Number(this.min)

    this.dataSubscription = this.dataService.finalData.asObservable().subscribe(x=>{
      if (this.sensor){
        this.value = Number(x[this.sensor].value)
      this.update();
      }
    })

    this.imageSubscription = this.httpClient.get(this.images).subscribe((data: any) => {
      this.listOfImages = data;
    });
  }
  
  ngAfterViewInit(){
    let dragRef:DragRef = this.dragDropService.createDrag(this.GaugeComponent);
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
    this.updateImage()
    this.cd.detectChanges();
  }

  updateImage(){
    if (this.listOfImages){
      let percentage = (this.value - this.min)/ (this.max - this.min)*100
      for (let index = 0; index < this.listOfImages.length; index++) {
        const element = this.listOfImages[index];
        let lowerBound = this.max/this.listOfImages.length*index
        let upperBound = (this.max/this.listOfImages.length)*(index+1)
        if (percentage >= lowerBound  && percentage <= upperBound && this.src != element){
          //set the image and break
          this.src = element
          break
        }
        else{
          //continue looking for correct image
        }
        
      }
    }
   
  }

  ngOnDestroy(){
    this.dataSubscription.unsubscribe()
  }


}
