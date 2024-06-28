import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalApiUrlService } from '../global-api-url.service';
@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  constructor(private http: HttpClient, private url:GlobalApiUrlService) {}
  REST_API = 'http://localhost:3000';

  getDateTime() {
    var API_URL = this.url.REST_API + '/get-date-time';
    return this.http.get(API_URL, {});
  } 


  toHHMMSS(secs:any) {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
  }

  getDatesOfWeekAndYear(w, y) {
    let date = new Date(y, 0, (1 + (w - 1) * 7)); // Elle's method
    date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
    var dateDebut = new Date(date)
    var dateFin = new Date(date.setDate(date.getDate() + 6))
    return dateDebut.toLocaleDateString() + " - " + dateFin.toLocaleDateString()
  }


  convertHeuretoSecond(heure:any){
    var a = heure.split(':');
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds
  }
  getDataDiff(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }
  ajoutZeroEntier(heure: any, minute: any, second: any) {
    let H = heure < 10 ? '0' + heure : heure
    let M = minute < 10 ? '0' + minute : minute
    let s = second < 10 ? '0' + second : second
    let result = H + ':' + M + ':' + s
    return result
  }
}
