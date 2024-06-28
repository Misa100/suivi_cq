import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { CryptageService } from '../cryptage/cryptage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private cookies:CookieService, private route:Router, private cryptageService:CryptageService) { }

  isUserLoggedIn: boolean = false;
  key:any = "secretKey"

  login(matricule:string, resultat:any): Observable<any>{
    
    this.isUserLoggedIn = resultat > 0;
    const valeurChiffrer = this.cryptageService.encryptValue(matricule)
    this.cookies.set('matricule', this.isUserLoggedIn ? valeurChiffrer : '' ); // Cookies Services
    sessionStorage.setItem('hide', this.isUserLoggedIn ? 'true' : 'false') // Session Storage
    
    return of(this.isUserLoggedIn).pipe(
      delay(100),
      tap(val =>{
        console.log("Is User Authentication is successful: " + val);        
      })
    )
  }

  logout(): void{
    this.isUserLoggedIn = false;
    this.cookies.set('matricule','') // Cookies Services
    sessionStorage.setItem('hide', 'false') // Session Storage
    this.cookies.delete("data_utilisateur")
    this.route.navigate([this.cryptageService.decryptValue(sessionStorage.getItem("currentUrl"))])
  }
  
}
