import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';

import { GlobalApiUrlService } from '../global-api-url.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const blob = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  responseType: 'blob' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class AccueilService {

  constructor(private http: HttpClient, private url:GlobalApiUrlService) { }
  REST_API = "http://localhost:3000";

  exportAsExcelFile(data: any): any {
    var API_URL = this.url.REST_API + '/excel-export';
    console.log('Sending POST request to:', API_URL, 'with data:', data);
    return this.http.post<Blob>(API_URL, data, blob);
  }
  
  getTypeControl(){
    var API_URL = this.url.REST_API+'/get-type-controle';
    return this.http.get(API_URL, {})
  }

  getLivraison(data:any){
    var API_URL = this.url.REST_API+'/get-livraison';
    return this.http.post(API_URL, data,httpOptions)
  }

  getListTypage(){
    var API_URL = this.url.REST_API+'/get-list-typage';
    return this.http.get(API_URL,{})
  }
  
  getReprise(data:any){
    var API_URL = this.url.REST_API+'/get-reprise';
    return this.http.post(API_URL, data, httpOptions)
  }

  getEchantillon(data:any){
    var API_URL = this.url.REST_API+'/get-echantillon';
    return this.http.post(API_URL, {data},httpOptions)
  }

  // saveDownload(){
  //   var API_URL = this.url.REST_API+'/save-download';
  //   return this.http.get(API_URL, {})
  // }
  
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';