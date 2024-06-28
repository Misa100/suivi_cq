// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Injectable } from '@angular/core';


// import { GlobalApiUrlService } from '../global-api-url.service';


// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {

//   constructor(private http:HttpClient, private url:GlobalApiUrlService) { }
//   REST_API = "http://localhost:3000";

//   getAllUserGPAO(matricule: any){
//     var API_URL = this.url.REST_API+'/get-user-gpao';
//     return this.http.post(API_URL, {matricule}, httpOptions)
//   } 
//   getAllUser(){
//     var API_URL = this.url.REST_API+'/get-all-users';
//     return this.http.get(API_URL, {})
//   } 
//   insertUser(nom_user:any, prenom_user:any, matricule:any, password_user:any, role_user:any){
//     var API_URL = this.url.REST_API+'/insert-users'
//     return this.http.post(API_URL, {nom_user, prenom_user, matricule, password_user, role_user}, httpOptions)
//   } 
//   updateUser(matricule:any, nom_user:any, prenom_user:any, password_user:any, role_user:any, id:any){
//     var API_URL = this.url.REST_API+'/update-users'
//     return this.http.post(API_URL, {matricule,nom_user,prenom_user,password_user,role_user,id}, httpOptions)
//   }
//   supprimerUser(id_utilisateur:any){
//     var API_URL = this.url.REST_API+'/delete-user';
//     return this.http.post(API_URL, {id_utilisateur}, httpOptions)
//   }
//   getUser(matricule:any){
//     var API_URL = this.url.REST_API+'/get-user';
//     return this.http.post(API_URL, {matricule}, httpOptions)
//   }

// }


import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { GlobalApiUrlService } from '../global-api-url.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient, private url:GlobalApiUrlService) { }
  REST_API = "http://localhost:3000";

  getAllUserGPAO(matricule: any){
    var API_URL = this.url.REST_API+'/get-user-gpao';
    return this.http.post(API_URL, {matricule}, httpOptions)
  } 
  getAllUser(){
    var API_URL = this.url.REST_API+'/get-all-users';
    return this.http.get(API_URL, {})
  } 
  insertUser(nom_user:any, prenom_user:any, matricule:any, password_user:any, role_user:any){
    var API_URL = this.url.REST_API+'/insert-users'
    return this.http.post(API_URL, {nom_user, prenom_user, matricule, password_user, role_user}, httpOptions)
  } 
  updateUser(matricule:any, nom_user:any, prenom_user:any, password_user:any, role_user:any, id:any){
    var API_URL = this.url.REST_API+'/update-users'
    return this.http.post(API_URL, {matricule,nom_user,prenom_user,password_user,role_user,id}, httpOptions)
  }
  supprimerUser(id_utilisateur:any){
    var API_URL = this.url.REST_API+'/delete-user';
    return this.http.post(API_URL, {id_utilisateur}, httpOptions)
  }
  getUser(matricule:any){
    var API_URL = this.url.REST_API+'/get-user';
    return this.http.post(API_URL, {matricule}, httpOptions)
  }

    
  getProcessusLean(){
    var API_URL = this.url.REST_API+'/get-processus-lean';
    return this.http.get(API_URL, {})
  } 

}
