import { Component, OnInit,QueryList,ViewChildren } from '@angular/core';
import { LocationsService } from 'src/app/services/locations.service';
import { dataObject } from "../../../interfaces/dataObject";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})



export class MainComponent implements OnInit {
  @ViewChildren('moveableComponent') mycomponents!: QueryList<any>;
  

  localStorage:any

  finalObject :dataObject={};
  

  constructor(private locationsService:LocationsService) {
    
   }

  ngOnInit(): void {
    
    this.localStorage = window.localStorage.getItem("SensorPanelCoordinates")
    if (this.localStorage == null) {
      this.locationsService.initLocations(JSON.parse(JSON.stringify({})))
    }   
    else {
      this.locationsService.initLocations(JSON.parse(this.localStorage))
    }

  }


  

    drawGauges(){
      //TODO: Draw the gauges using the object's data
      this.drawMotherBoardTTempGauge()
  }

    
    drawMotherBoardTTempGauge(){
      
    }
}
