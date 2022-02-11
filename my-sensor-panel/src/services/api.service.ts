import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  eventSource: any;
  constructor(private httpClient:HttpClient) { 
    this.eventSource = new EventSource("http://192.168.1.182:4050/sse")
  }
}
