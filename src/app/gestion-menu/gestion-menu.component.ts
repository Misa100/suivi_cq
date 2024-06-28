import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { MenuService } from '../services/menu/menu.service';
import { ToastService } from '../services/toast/toast.service';
import { CryptageService } from '../services/cryptage/cryptage.service';

@Component({
  selector: 'app-gestion-menu',
  templateUrl: './gestion-menu.component.html',
  styleUrls: ['./gestion-menu.component.css']
})
export class GestionMenuComponent implements OnInit {

  constructor(private menuService:MenuService, private toast:ToastService, private http:HttpClient, private router:Router, private menu:AppComponent, private cookies:CookieService, private cryptageService:CryptageService) {
    sessionStorage.setItem('currentUrl', this.cryptageService.encryptValue(this.router.url))
  }

  titreLogin:any
  titreMenuMax:any
  titreMenuMin:any
  
  icon: any
  liste_menu:any
  liste_sous_menu:any

  iconMenu: any = 'bi bi-plus-lg'
  iconSousMenu: any = 'bi bi-plus-lg'
  nomSousMenu: any = ""
  routeSousMenu: any = ""
  nomMenu: any = ''
  routeMenu: any = ''
  nextRang: any = ''
  accessibilite:any
  accessibilite_sous_menu:any
  readyToAdd: boolean = true
  readyToAddSousMenu: boolean = true
  ifDrag: boolean = true
  ifDragSousMenu: boolean = true
  searchIconMenu:any
  searchIconSM:any
  cookie:any = JSON.parse(this.cryptageService.decryptValue(this.cookies.get("data_utilisateur")))

  ngOnInit(): void {
    this.getTitreApp()
    this.menuService.getJson().subscribe(data=>{
      this.icon = data
    })
    this.listeMenu()
  }

  getTitreApp(){
    this.menuService.getTitre().subscribe(
      data => {
        this.titreLogin = data[0].titreLogin
        this.titreMenuMax = data[0].titreMenuMax
        this.titreMenuMin = data[0].titreMenuMin
      }
    )
  }

  updateTitreApp(titreLogin:any, titreMenuMax:any, titreMenuMin:any){
    if((titreLogin == '' || titreLogin == undefined) || (titreMenuMax == '' || titreMenuMax == undefined) || (titreMenuMin == '' || titreMenuMin == undefined)){
      this.toast.Warning('Ces champs sont obligatoires !')
      this.getTitreApp()
    } else {
      this.menuService.updateTitre(titreLogin,titreMenuMax,titreMenuMin).subscribe(
        data => {},
        error => {},
        () => {
          this.toast.Success('Titre modifié !')
          this.menu.getTitreApp()
        }
      )
    }
  }

  // Fonction Drag & Drop Menu
  drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.liste_menu, event.previousIndex, event.currentIndex);
      this.enregistrerRang()
      this.ifDrag = false    
    }

    // Enregistrement Rang Menu
    enregistrerRang(){
    for(let i = 0; i < this.liste_menu.length; i++){
      let range = i + 1
      let id_menu = this.liste_menu[i].id_menu
      this.menuService.updateRangMenu(range, id_menu).subscribe(
        data => {},
        error => {},
        () => {
          this.menu.listeMenu(this.cookie.role)
        }
      )
    }
  }

  // Fonction Drag & Drop Sous Menu
  dropSousMenu(event: CdkDragDrop<string[]>, index:any, id_menu:any) {
    for(let i=0; i<this.liste_menu.length; i++){
      if(i == index){
        let liste_sous_menu = this.liste_menu[i].sous_menu
        if(liste_sous_menu != null){
          moveItemInArray(liste_sous_menu, event.previousIndex, event.currentIndex);
          this.ifDragSousMenu = false

          // Enregistrement Rang Sous Menu
          let updateRankSousMenu = JSON.stringify(liste_sous_menu)
          this.menuService.updateSousMenu(id_menu, updateRankSousMenu).subscribe(
            data => {},
            error => {},
            () => {
              this.menu.listeMenu(this.cookie.role)
            }
          )
        } else {
          liste_sous_menu = []
        }
      }
    }
  }

  // Récupération Liste Menu / Sous Menu
  listeMenu(){
    let accessibilite = 3
    this.menuService.getMenu(accessibilite).subscribe(
      data => {this.liste_menu = data},
      error => {},
      () => {
        for(let i=0; i<this.liste_menu.length; i++){
          this.liste_menu[i].sous_menu = JSON.parse(this.liste_menu[i].sous_menu)
        }
      }
    )
  }

  //Modification Menu
  modifierMenu(data:any){
    let nom = data.nom_menu
    let route = data.route_menu
    let rang = data.rang_menu
    let icon = data.icon_menu
    let id = data.id_menu
    let accessibilite = data.accessibilite
    this.menuService.updateMenu(nom,route,rang,icon,id,accessibilite).subscribe(
      data => {
        this.toast.Success('')
        this.listeMenu()
      },
      error => {},
      () => {
        this.menu.listeMenu(this.cookie.role)
      }    
    )
  }

  // Modification Sous Menu
  modifierSousMenu(data:any ,id_menu:any ,indexMere:any, index:any){
    for(let i=0; i<this.liste_menu.length; i++){
      if(i == indexMere){
        for(let y=0; y<this.liste_menu[i].sous_menu.length; y++){
          if(y == index){
            let updateSousMenu = JSON.stringify(data)
            console.log(updateSousMenu)
            console.log(id_menu)
            this.menuService.updateSousMenu(id_menu, updateSousMenu).subscribe(
              data => {},
              error => {},
              () => {
                this.toast.Success('')
                this.menu.listeMenu(this.cookie.role)
              }
            )
          }
        }
      }
    }
  }

  //Ajout sousmenu
  ajoutSousMenus(iconSM:any, nomSM:any,routeSM:any,accessibilite_SM:any,index_mere:any,id_menu:any){
    let objSM = {"icon_sous_menu":iconSM,"nom_sous_menu":nomSM,"route_sous_menu":routeSM,"accessibilite_sous_menu":accessibilite_SM}
    for(let i = 0; i < this.liste_menu.length;i++){
      if(index_mere == i){
        this.liste_menu[i].sous_menu.push(objSM)
        let add_sous_menu = JSON.stringify(this.liste_menu[i].sous_menu)
        this.menuService.updateSousMenu(id_menu,add_sous_menu).subscribe(
          data => {},
          error => {},
          () => {
            this.toast.Success('')
            this.annulerAjout()
            this.menu.listeMenu(this.cookie.role)
          }
        )
      }
    }
    console.log(objSM)
  }
  // Récupération Icon to ADD
  getIcon(icon:any){
    this.iconMenu = icon
    this.readyToAdd = false
    this.menuService.getMaxRangMenu().subscribe(
      data => this.nextRang = Number(data[0].max) + 1
    )
  }

  // Récupération Icon Sous Menu to ADD
  getIconSousMenu(icon:any){
    this.iconSousMenu = icon
    this.readyToAddSousMenu = false
  }

  // Suppression Menu
  supprimerMenu(id_menu:any){
    Swal.fire({
      title: 'Suppression',
      text: "Voulez-vous vraiment supprimer ce menu ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.supprimerMenu(id_menu).subscribe(
          data => {
            this.listeMenu()
            Swal.fire({
              title: 'Supprimée !',
              text: 'Opération réussie',
              icon: 'success'
            }).then((result) => {
              if(result.isConfirmed){
                this.enregistrerRang()
              }
            })
          }
        )
      }
    })
  }

  // Suppression Sous Menu
  supprimerSousMenu(id_menu:any ,indexMere:any, index:any){
    for(let i=0; i<this.liste_menu.length; i++){
      if(i == indexMere){
        for(let y=0; y<this.liste_menu[i].sous_menu.length; y++){
          if(y == index){
            Swal.fire({
              title: 'Suppression',
              text: "Voulez-vous vraiment supprimer ce menu ?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Oui, supprimer',
              cancelButtonText: 'Non'
            }).then((result) => {
              if (result.isConfirmed) {
                this.liste_menu[i].sous_menu.splice(y,1);
                let restSousMenu = JSON.stringify(this.liste_menu[i].sous_menu)
                this.menuService.updateSousMenu(id_menu, restSousMenu).subscribe(
                  data => {this.toast.Success('')},
                  error => {},
                  () => {
                    this.menu.listeMenu(this.cookie.role)
                  }
                )
              }
            })
          }
        }
      }
    }
  }

  // Ajout Menu
  ajouterMenu(icon:any, nom:any, route:any, accessibilite:any){
    if(nom == "" || accessibilite == undefined){
      this.toast.Warning('Veuillez renseigner les champs')
    } else {
      this.menuService.insertMenu(nom, route, this.nextRang, icon, accessibilite).subscribe(
        data => {},
        error => {},
        () => {
          this.listeMenu()
          this.toast.Success('')
          this.iconMenu = 'bi bi-plus-lg'
          this.nomMenu = ''
          this.routeMenu = ''
          this.nextRang = ''
          this.accessibilite = undefined
          this.menu.listeMenu(this.cookie.role)
        }
      )
    }
  }

  // Annulation Ajout Menu / Sous Menu
  annulerAjout(){
    this.iconMenu = 'bi bi-plus-lg'
    this.iconSousMenu = 'bi bi-plus-lg'
    this.nomSousMenu =""
    this.routeSousMenu = ""
    this.nomMenu = ''
    this.routeMenu = ''
    this.nextRang = ''
    this.readyToAdd = true
    this.readyToAddSousMenu = true
    this.accessibilite = undefined
    this.accessibilite_sous_menu = undefined
  }

}
