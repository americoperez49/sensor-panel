import { CdkDragMove, CdkDragRelease, DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Coordinates } from 'src/app/interfaces/Coordinates';
import { LocationsService } from 'src/app/services/locations.service';

//chaqrt example stuff
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit {
  @ViewChild('moveableGauge') GaugeComponent!:ElementRef
  deltaX:number=0
  deltaY:number=0;
  @Input() id:any = null;


  //chart example stuff
  
  public chartOptions: Partial<ChartOptions>;

  constructor(public locationsService:LocationsService,private dragDropService: DragDrop) {
    this.chartOptions = {
      series: [100],
      chart: {
        height: 145,
          width:145,
        type: "radialBar",
        offsetY: -10
      },
      
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          
          track: {
            background: "#fff",
            strokeWidth: "67%",
            margin: 0, // margin is in pixels
            opacity:0,
            dropShadow: {
              enabled: false,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0
            }
          },
          dataLabels: {
            
            name: {
              fontFamily: "Righteous",
              fontSize: "64px",
              color: "#FFFFFF",
              offsetY: 120
            },
            value: {
              offsetY: -10,
              fontSize: "18px",
              color: "#FFFFFF",
              formatter: function(val) {
                return val + "%";
              }
            }
          }
        }
      },
      
      
      fill: {
        type: "gradient",
        colors:["#C14848"],
        gradient: {
          shade: "dark",
          type: "verti",
          shadeIntensity: 0.5,
          gradientToColors: ["#14ECF3"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 4
      },
      labels: [""]
    };
   }

  ngOnInit(): void {
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

}
