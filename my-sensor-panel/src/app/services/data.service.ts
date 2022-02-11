import { Injectable } from '@angular/core';
import {  delay, Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  eventSource: EventSource;
  subscription :Subscription
  finalObject: any = {};
  finalData:Subject<any> = new Subject();

  sensorNames=[
    "Date",
    "Time",
    "Desktop Resolution",
    "Vertical Refresh Rate",
    "RTSS FPS",
    "NIC3 Download Rate",
    "NIC3 Upload Rate",
    "Motherboard",
    "CPU Package",
    "GPU",
    "CPU",
    "CPU Clock",
    "CPU Utilization",
    "Memory Utilization",
    "Used Memory",
    "Free Memory",
    "Samsung SSD 970 EVO Plus Temperature",
    "PNY CS900 120GB SSD",
    "Drive C: Used Space",
    "Drive C: Free Space",
    "Drive D: Used Space",
    "Drive D: Free Space",
    "GPU Diode",
    "GPU Clock",
    "Used Video Memory",
    "Free Video Memory",
    "GPU UtiliZation",
    "Master Volume",
]

  constructor() {
    this.eventSource = new EventSource("http://192.168.1.182:4050/sse")
    this.subscription = new Subscription();
    this.subscribeToData()
   }

  subscribeToData(){
    //create observable from the eventSource
    const observable = Observable.create((observer: { next: (arg0: any) => any; error: (arg0: Event) => any; }) => {
      this.eventSource.onmessage = x => observer.next(x.data);
      this.eventSource.onerror = x => observer.error(x);

      return () => {
        this.eventSource.close();
      };
    });

    //subscribe to the observable
    this.subscription = observable.subscribe({
      next: (data: String) => {
        this.parseData(data)
      },
      error: (_err: any) =>  location.reload()
    });
  }

   parseData(data: String){
     //create array of data entries
      let splitData:String[] = data.split("{|}");

     
      for (let index = 1; index < splitData.length-1; index++) {
        //split the data into value/units and feed into an object
        const element:String = splitData[index].split("|")[1];
        let splitValue_And_Units:String[] = element.split("@")
        let value =(splitValue_And_Units[0]);
        let units=splitValue_And_Units[1] != undefined? splitValue_And_Units[1]:"";
        // console.log(value + " " + units)

        this.finalObject[this.sensorNames[index-1]] ={
          "value":value,
          "units":units
        }
        
      }
      delay(500)
      // console.log("\n")
      this.finalData.next(this.finalObject);
  }
}
