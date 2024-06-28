import { Component, HostListener } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth/auth.service';
import { MenuService } from './services/menu/menu.service';
import { ToastService } from './services/toast/toast.service';
import { UsersService } from './services/users/users.service';
import { CryptageService } from './services/cryptage/cryptage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  constructor(private router:Router, private formBuilder:UntypedFormBuilder, private authService: AuthService, private menuService:MenuService, private cookies:CookieService, private userService:UsersService, private toast:ToastService, private cryptageService:CryptageService) {
    if(sessionStorage.getItem('hide') == 'true' && this.cryptageService.decryptValue(this.cookies.get("matricule")) != '' && this.router.url == '/'){
      this.router.navigate([this.cryptageService.decryptValue(sessionStorage.getItem('currentUrl'))])
    }
  }

  nameApp: any
  nameMenuMax: any
  nameMenuMin: any

  title = 'demo-angular'
  innerWidth: any;

  hide: boolean
  hideLogin: boolean = true
  hideMenu: boolean = false

  menu:boolean

  matricule: any
  password: any
  resultat: any
  element: any
  liste_menu: any
  show: boolean = true
  buttonName:any
  role:any
  role_defaut:any = "Utilisateur"

  accessibilite:any

  menuResize:any 

  titreComponent:any

  showPassword: boolean = false;
  
  changerMenuSize(){
    if(this.menuResize == true){
      this.menuResize = false
    } else {
      this.menuResize = true
    }
  }

  changeTitle(route:any, routeSM:any){
    let currentRoute = route == '' ? routeSM : route 
    let titleComponent   
    for(let i=0; i<this.router.config.length; i++){
      if(this.router.config[i].path == currentRoute){
        titleComponent = this.router.config[i].data.titreComponent
        this.router.config[i].title = sessionStorage.getItem('nameApp') + " | " + titleComponent
      }
    }
    if(titleComponent == '' || titleComponent == undefined || titleComponent == null){
      for(let i=0; i<this.router.config.length; i++){
        if('/'+this.router.config[i].path == sessionStorage.getItem('currentUrl')){
          this.titreComponent = this.router.config[i].data.titreComponent
          this.router.config[i].title = sessionStorage.getItem('nameApp') + " | " + this.titreComponent
        }
      }
    } else {
      this.titreComponent = titleComponent
    }
  }

  ngOnInit(){

    this.getTitreApp()
    
    this.changerMenuSize()

    this.hide = JSON.parse(sessionStorage.getItem('hide'))
    
    if(this.hide == false || this.hide == undefined || this.hide == null){
      this.hideLogin = true
      this.hideMenu = false
    } else {
      this.hideLogin = false
      this.hideMenu = true
      this.matricule = this.cryptageService.decryptValue(this.cookies.get("matricule"))
    }

    this.userService.getUser(this.cryptageService.decryptValue(this.cookies.get("matricule"))).subscribe(
      data => { 
        this.role = data["length"] == 0 ? this.role_defaut : data[0].role_user
        this.listeMenu(this.role) 
      }
    )
    
  }

  getTitreApp(){
    this.menuService.getTitre().subscribe(
      data => {
        this.nameApp = data[0].titreLogin
        sessionStorage.setItem('nameApp',this.nameApp)

        this.nameMenuMax = data[0].titreMenuMax
        this.nameMenuMin = data[0].titreMenuMin
      }
    )
  }

  deconnexion(){
    this.authService.logout()
    for(let i=0; i<this.router.config.length; i++){
      if('/'+this.router.config[i].path == sessionStorage.getItem('currentUrl')){
        this.titreComponent = this.router.config[i].data.titreComponent
        this.router.config[i].title = sessionStorage.getItem('nameApp') + " | " + this.titreComponent
      }
    }
    this.hideLogin = true
    this.hideMenu = false
  }

  listeMenu(role:any){
    if(role == 'Administrateur'){
      this.accessibilite = 3
    } else if(role == 'Responsable'){
      this.accessibilite = 2
    } else {
      this.accessibilite = 1
    }

    this.menuService.getMenu(this.accessibilite).subscribe(
      data => {this.liste_menu = data}, error => {}, () => {
        for(let i=0; i<this.liste_menu.length; i++){
          this.liste_menu[i].sous_menu = JSON.parse(this.liste_menu[i].sous_menu)
          for(let item in this.liste_menu[i].sous_menu){
            this.liste_menu[i].sous_menu = this.liste_menu[i].sous_menu.filter(f => f.accessibilite_sous_menu <= this.accessibilite)
          }
        }
      } 
    )

    for(let i=0; i<this.router.config.length; i++){
      if(sessionStorage.getItem("currentUrl") != null){
        if('/'+this.router.config[i].path == this.cryptageService.decryptValue(sessionStorage.getItem("currentUrl"))){
          this.titreComponent = this.router.config[i].data.titreComponent
          this.router.config[i].title = sessionStorage.getItem('nameApp') + " | " + this.titreComponent
        }
      }     
    }
  }

  isNullOrUndefined(variable:any){
    return variable == undefined || variable == null || variable == "" ? true : false
  }

  resetLogin(){
    this.matricule = ""
    this.password = ""
  }
       
  connexion(){        
    if(this.isNullOrUndefined(this.matricule) || this.isNullOrUndefined(this.password)){
      this.toast.Warning("Veuillez remplir les champs")
    } else {
      this.menuService.loginFromGpao(this.matricule, this.password).subscribe(
        data => { this.resultat = data }, error => {}, () => {   
          if(this.resultat.length == 0){
            this.toast.Error("Mot de passe incorrect")
            this.hideLogin = true
            this.hideMenu = false
          } else {
            this.authService.login(this.matricule, this.resultat.length).subscribe(
              data => {console.log(data)}, error => {}, () => {
                let nom_user = this.resultat[0].nom
                let prenom_user = this.resultat[0].prenoms
                let password_user = this.resultat[0].passwd
                let matricule = this.cryptageService.decryptValue(this.cookies.get("matricule"))
                let resultDataFromUser:any = []
                this.userService.getUser(matricule).subscribe(
                  data => { resultDataFromUser = data }, error => {}, () => {
                    if(resultDataFromUser.length == 0){
                      this.userService.insertUser(nom_user, prenom_user, matricule, password_user, this.role_defaut).subscribe(
                        data => {
                          const myData = { 
                            nom : nom_user,
                            prenom : prenom_user,
                            fullname : nom_user + ' ' + prenom_user,
                            role : this.role_defaut,
                            id_utilisateur : data[0].id_utilisateur
                          };
                          const encryptedData = this.cryptageService.encryptValue(myData)
                          this.cookies.set("data_utilisateur",encryptedData)
                          this.role = this.role_defaut
                        }
                      )
                    }
                    else {
                      const myData = { 
                        nom : resultDataFromUser[0].nom_user,
                        prenom : resultDataFromUser[0].prenom_user,
                        fullname : resultDataFromUser[0].nom_user + ' ' + resultDataFromUser[0].prenom_user,
                        role : resultDataFromUser[0].role_user,
                        id_utilisateur : resultDataFromUser[0].id_utilisateur
                      };
                      const encryptedData = this.cryptageService.encryptValue(myData)
                      this.cookies.set("data_utilisateur",encryptedData)
                      this.role = resultDataFromUser[0].role_user
                    }

                    let dataMenu
                    this.listeMenu(resultDataFromUser.length == 0 ? this.role_defaut : resultDataFromUser[0].role_user)
                    this.menuService.getMenu(this.accessibilite).subscribe(
                      data => {dataMenu = data}, error => {}, () => {
                        let acces 
                        console.log(dataMenu)
                        for(let item in dataMenu){
                          dataMenu[item].sous_menu = JSON.parse(dataMenu[item].sous_menu)
                          dataMenu[item].sous_menu = dataMenu[item].sous_menu.filter(f => f.accessibilite_sous_menu <= this.accessibilite)
                          if('/'+dataMenu[item].route_menu == this.router.url) {acces = true}
                          else if(this.role == 'Responsable' && '/users' == this.router.url) {acces = true}
                          else if(this.role == 'Administrateur' && ('/users' == this.router.url || '/gestion-menu' == this.router.url)) {acces = true}
                          for(let item_sm in dataMenu[item].sous_menu){
                            if('/'+dataMenu[item].sous_menu[item_sm].route_sous_menu == this.router.url){
                              acces = true
                            }                            
                          }
                        }
                        if(acces == undefined){
                          for(let i=0; i<this.router.config.length; i++){
                            if('/'+this.router.config[i].path == '/accueil'){
                              this.titreComponent = this.router.config[i].data.titreComponent
                              this.router.config[i].title = sessionStorage.getItem('nameApp') + " | " + this.titreComponent
                            }
                          }
                          this.router.navigate(['accueil'])
                          this.toast.Info('Vous ne pouvez pas accéder à cette partie (\''+this.router.url+'\')')
                        }
                      }
                    )

                    for(let i=0; i<this.router.config.length; i++){
                      if('/'+this.router.config[i].path == this.router.url){
                        this.titreComponent = this.router.config[i].data.titreComponent
                        this.router.config[i].title = sessionStorage.getItem('nameApp') + " | " + this.titreComponent
                      }
                    }
                    
                    this.hideLogin = false
                    this.hideMenu = true
                  }
                )

                let hide = sessionStorage.getItem('hide')
                if(matricule != ''){
                  if(this.router.url == '/'){
                    this.hide = JSON.parse(hide)
                    this.router.navigate(['/accueil'])
                  } else {
                    this.hide = JSON.parse(hide)
                  }
                }
              }
            )
            this.password = ""
          }
        }
      )
    }
  }

}


