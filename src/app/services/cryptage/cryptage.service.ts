import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CryptageService {

  constructor() { }

  key:any = "secretKey"

  encryptValue(value: any): string {
    return CryptoJS.AES.encrypt(typeof(value) == "object" ? JSON.stringify(value) : value, this.key).toString();    
  }

  decryptValue(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}
