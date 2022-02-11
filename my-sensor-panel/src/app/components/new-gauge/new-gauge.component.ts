import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CdkDragMove, CdkDragRelease, DragRef, DragDrop, Point } from '@angular/cdk/drag-drop';
import { Coordinates } from "../../interfaces/Coordinates";
import { LocationsService } from 'src/app/services/locations.service';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { ApexNonAxisChartSeries, ApexPlotOptions, ApexChart, ApexFill, ChartComponent, ApexStroke } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-new-gauge',
  templateUrl: './new-gauge.component.html',
  styleUrls: ['./new-gauge.component.scss']
})


export class NewGaugeComponent implements OnInit {
  @ViewChild('moveableGauge') GaugeComponent!: ElementRef
  @Input() color!: string
  @Input() id: any = null;
  @Input() sensor: any = null
  dataSubscription: Subscription = new Subscription();

  deltaX: number = 0
  deltaY: number = 0;
  value: any;
  units: any

  public chartOptions: Partial<ChartOptions>;
  public innerRing: Partial<ChartOptions>;
  public outerRing: Partial<ChartOptions>;



  constructor(private cd: ChangeDetectorRef, public locationsService: LocationsService, private dragDropService: DragDrop, public dataService: DataService) { 
    this.chartOptions = {
      series: [41],
      chart: {
        height: 205,
          width:205,
        type: "radialBar",
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
                return val + "°C";
              }
            }
          }
        }
      },
      
      
      fill: {
        type: "gradient",
        colors:["#C14848"],
        gradient: {
          shade: "light",
          type: "horizontal",
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

    this.innerRing ={
      series: [100],
      chart: {
        height: 136,
        width:136,
        offsetX:34.5,
        offsetY:34.5,
        type: "radialBar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "85%",
            background: 'transparent',
            image: undefined,
            position: "front",
            dropShadow: {
              enabled: false,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 1
            }
          },
          track: {
            background: "#fff",
            strokeWidth: "1%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 1
            }
          },

          dataLabels: {
            show: true,
           
            name: {
              offsetY: -10,
              show: false,
              color: "#888",
              fontSize: "17px"
            },
            
            value: {
              color: "#ffffff",
              offsetY:17,
              fontSize: "36px",
              show: false
            }
          }
        }
      },
      fill: {
        type: "solid",
        colors:["#16edf5"]
      },
      stroke: {
        lineCap: "round"
      },
      labels: [""]
    };

    this.outerRing ={
      series: [100],
      chart: {
        height: 176,
        width:176,
        offsetX:14.5,
        offsetY:14.5,
        type: "radialBar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "90%",
            background: 'transparent',
            image: undefined,
            position: "front",
            dropShadow: {
              enabled: false,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 1
            }
          },
          track: {
            background: "#fff",
            strokeWidth: "1%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 1
            }
          },

          dataLabels: {
            show: true,
           
            name: {
              offsetY: -10,
              show: false,
              color: "#888",
              fontSize: "17px"
            },
            
            value: {
              color: "#ffffff",
              offsetY:17,
              fontSize: "36px",
              show: false
            }
          }
        }
      },
      fill: {
        type: "solid",
        colors:["#16edf5"]
      },
      stroke: {
        lineCap: "round"
      },
      labels: [""]
    };
  }

  ngOnInit(): void {
    this.value = ""
    this.units = ""

    this.dataSubscription = this.dataService.finalData.asObservable().subscribe(x => {
      if (this.sensor) {
        this.value = x[this.sensor].value
        this.units = x[this.sensor].units
        this.update();
      }
    })
  }

  ngAfterViewInit() {
    let dragRef: DragRef = this.dragDropService.createDrag(this.GaugeComponent);
    if (this.locationsService.locations[this.id]) {
      dragRef.setFreeDragPosition(this.locationsService.locations[this.id])
    }
    else {
      dragRef.setFreeDragPosition({ x: 0, y: 0 })
    }
  }

  released($event: CdkDragRelease) {
    var originalCoordinates: Coordinates;
    var finalCoordinates: Coordinates

    originalCoordinates = this.locationsService.locations[this.id] // returns { x: 0, y: 0 }
    if (originalCoordinates == null) originalCoordinates = { x: 0, y: 0 }
    finalCoordinates = JSON.parse(JSON.stringify(originalCoordinates))
    finalCoordinates.x += this.deltaX
    finalCoordinates.y += this.deltaY
    console.log(`> Position X: ${finalCoordinates.x} - Y: ${finalCoordinates.y}`)

    if ($event.source.element.nativeElement.parentElement?.id) {
      this.locationsService.updateLocations($event.source.element.nativeElement.parentElement.id, finalCoordinates)
    }
    else {
      console.log("You need to add an Id to this component")
    }

  }

  moved($event: CdkDragMove) {
    this.deltaX = $event.distance.x
    this.deltaY = $event.distance.y
    // console.log($event.distance)
  }

  update() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe()
  }

}
