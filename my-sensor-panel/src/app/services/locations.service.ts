import { Injectable } from '@angular/core';
import { Coordinates } from '../interfaces/Coordinates';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  locations:any = {}

  constructor() { }
  initLocations (locations:any){
    this.locations = locations
  }

  updateLocations(componentID:string, coordinates:Coordinates){
    this.locations[componentID]=coordinates
    window.localStorage.setItem("SensorPanelCoordinates",JSON.stringify(this.locations))
  }
}
