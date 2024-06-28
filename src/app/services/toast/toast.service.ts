import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  Success(message){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'success',
        title: message == '' || message == null || message == undefined ? 'Opération réussie' : message,
      })
  } 

  Error(message){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'error',
        title: message == '' || message == null || message == undefined ? 'Echec de l\'opération' : message
      })
  } 

  Warning(message){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'warning',
        title: message == '' || message == null || message == undefined ? 'Opération annulée' : message
      })
  } 

  Info(message){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'info',
        title: message
      })
  }
}
