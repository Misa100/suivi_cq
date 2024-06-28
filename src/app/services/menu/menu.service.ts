import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalApiUrlService } from '../global-api-url.service';
import * as CryptoJS from 'crypto-js';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private url:GlobalApiUrlService) { }
  REST_API = "http://localhost:3000";
  
  getMenu(accessibilite:any){
    var API_URL = this.url.REST_API+'/get-menu';
    return this.http.post(API_URL, {accessibilite}, httpOptions)
  }  

  getDateNow(){
    var API_URL = this.url.REST_API+'/get-date';
    return this.http.get(API_URL, {})
  }  
  
  getTitre(){
    var API_URL = this.url.REST_API+'/get-titre';
    return this.http.get(API_URL, {})
  }
   

  getLogin(matricule:string, password:string){
    var API_URL = this.url.REST_API+'/get-login';
    return this.http.post(API_URL, {matricule, password}, httpOptions)
  }

  getJSON(): Observable<any>{
    return this.http.get('./././assets/plugins/icons-fa5.json');
  }

  getMaxRangMenu(){
    var API_URL = this.url.REST_API+'/get-max-rang-menu';
    return this.http.get(API_URL, {})
  }
  
  updateMenu(nom_menu:string, route_menu:string, rang_menu:any, icon_menu:string, id_menu:any, accessibilite:any){
    var API_URL = this.url.REST_API+'/update-menu'
    return this.http.post(API_URL, {nom_menu,route_menu,rang_menu,icon_menu,id_menu,accessibilite}, httpOptions)
  }   
  
  updateTitre(titreLogin:string, titreMenuMax:string, titreMenuMin:any){
    var API_URL = this.url.REST_API+'/update-titre'
    return this.http.post(API_URL, {titreLogin,titreMenuMax,titreMenuMin}, httpOptions)
  }   
  
  supprimerMenu(id_menu:any){
    var API_URL = this.url.REST_API+'/supprimer-menu'
    return this.http.post(API_URL, {id_menu}, httpOptions)
  }   
  
  insertMenu(nom_menu:any, route_menu:any, rang_menu:any, icon_menu:any, accessibilite:any){
    var API_URL = this.url.REST_API+'/insert-menu'
    return this.http.post(API_URL, {nom_menu, route_menu, rang_menu, icon_menu, accessibilite}, httpOptions)
  } 
  
  updateRangMenu(range:any, id_menu:any){
    var API_URL = this.url.REST_API+'/update-rang-menu'
    return this.http.post(API_URL, {range, id_menu}, httpOptions)
  }

  updateSousMenu(id_menu:any, restSousMenu:any){
    var API_URL = this.url.REST_API+'/update_sous_menu'
    return this.http.post(API_URL, {restSousMenu, id_menu}, httpOptions)
  }

  loginFromGpao(matricule:any, password:any){
    var API_URL = this.url.REST_API+'/login-gpao'
    return this.http.post(API_URL, {matricule, password}, httpOptions)
  }

  public getJson(): Observable<any>{
    return this.http.get('assets/plugins/BootstrapIcons.json')
  }
  
}

