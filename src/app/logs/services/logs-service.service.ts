import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LogException } from '../models/log-exception';
import { LogGroupCount } from '../models/log-groupcount';
import { LoggedinUser } from '../models/loggedin-user';

@Injectable({
  providedIn: 'root'
})
export class LogsServiceService {

  constructor(private _httpClient:HttpClient) { 

  }
  private _serviceBaseUrl: string = "http://localhost:3001/api";
  getAllLogs(): Observable<LogException[]> {
    return this._httpClient.get<LogException[]>(`${this._serviceBaseUrl}/Log`);
  }
  getgrpbyall(propname:any): Observable<LogGroupCount[]> {
    return this._httpClient.get<LogGroupCount[]>(`${this._serviceBaseUrl}/Log/groupbyproperty?propertyName=${propname}`);
  }
  getfiltereddata(propname:any,propvalue:any): Observable<LogException[]> {
    return this._httpClient.get<LogException[]>(`${this._serviceBaseUrl}/Log/filterexceptionbyproperty?propertyName=${propname}&propertyValue=${propvalue}`);
  }
  getDataWithArrayParameter(propname: any, propvalue: any, arrayData: LogException[]): Observable<LogException[]> {
    
    return this._httpClient.post<LogException[]>(`${this._serviceBaseUrl}/Log/filterexceptionbyproperty?propertyName=${propname}&propertyValue=${propvalue}`, arrayData);
  }
  postUserdetails(user: LoggedinUser){
    return this._httpClient.post<LoggedinUser>(`${this._serviceBaseUrl}/User`, user);
  }

}
