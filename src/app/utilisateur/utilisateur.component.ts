import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastService } from '../services/toast/toast.service';
import { UsersService } from '../services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../services/menu/menu.service';
import { CryptageService } from '../services/cryptage/cryptage.service';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private router:Router, private usersService:UsersService, private toast:ToastService, private cookies:CookieService, private menuService:MenuService, private cryptageService:CryptageService) { 
    sessionStorage.setItem('currentUrl', this.cryptageService.encryptValue(this.router.url))
  }

  cookie:any = JSON.parse(this.cryptageService.decryptValue(this.cookies.get("data_utilisateur")))
  role:any = this.cookie.role
  matricule_log:any = this.cryptageService.decryptValue(this.cookies.get('matricule'))
  liste_user_dynamic : any = []
  liste_user_static : any = []
  nom_user:any
  prenom_user:any
  matricule:any
  password_user:any
  data:any
  role_user:any
  matricule_filtre:any = ""

  ngOnInit(): void {
    this.listeUsers()
  }


  listeUsers(){
    this.usersService.getAllUser().subscribe(
      data => {
        this.liste_user_dynamic = data
        this.liste_user_static = data
      }
    )
  }

  filtre_matricule(){
    this.liste_user_dynamic = this.liste_user_static.filter(t => t.matricule.includes(this.matricule_filtre))
  }

  modifierUser(data:any){
    let id_utilisateur = data.id_utilisateur
    let matricule = data.matricule
    let nom_user = data.nom_user
    let prenom_user = data.prenom_user
    let password_user = data.password_user
    let role_user = data.role_user
    this.usersService.updateUser(matricule,nom_user,prenom_user,password_user,role_user,id_utilisateur).subscribe(
      data =>{
        this.listeUsers()
        this.toast.Success('')
      }
    )
  }
  supprimerUser(id_utilisateur:any){
    Swal.fire({
      title: 'Suppression',
      text: "Voulez-vous vraiment supprimer ces coordonnées ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.supprimerUser(id_utilisateur).subscribe(
          data => {}, 
          error => {},
          () => {
            this.listeUsers()
            this.toast.Success('')
          }
        )
      }
    })
  }

  async alertAdd(){
    
    let selectList:any = []
    if(this.role == "Responsable"){
      selectList = {
        Utilisateur : 'Utilisateur',
        Manager : 'Manager',
        Responsable : 'Responsable'
      }
    } else {
      selectList = {
        Utilisateur : 'Utilisateur',
        Manager : 'Manager',
        Responsable : 'Responsable',
        Administrateur : 'Administrateur'
      }
    }

    const { value: matricule } = await Swal.fire({
      title: 'Matricule de l\'utilisateur',
      input: 'text',
      confirmButtonText: 'Enregistrer',
      confirmButtonColor: '#53916c',
      showCancelButton: true,
      cancelButtonText: 'Annuler'
    })
    
    let ifExist:any
    let ifExistUser:any
    let resultDataFromGpao:any = []

    if (matricule) {
      this.usersService.getUser(matricule).subscribe(
        data => {ifExistUser = data['length']},
        error => {},
        () => {
          if(ifExistUser != 0){
            this.toast.Info("L'utilisateur est déjà enregistré")
            return
          }
          else {
            this.usersService.getAllUserGPAO(matricule).subscribe(
              data => {
                ifExist = data["length"]
                resultDataFromGpao = data
              },
              error => {},
              async () => {
                if(ifExist == 0){
                  this.toast.Warning('Matricule introuvable !')
                }
                else {
                  
                  const { value: role } = await Swal.fire({
                    title: 'Rôle de l\'utilisateur',
                    input: 'select',
                    confirmButtonColor: '#53916c',
                    confirmButtonText: 'Enregistrer',
                    inputOptions: selectList,
                    showCancelButton: true,
                    cancelButtonText: 'Annuler',
                  })
      
                  if(role){
                    this.usersService.insertUser(resultDataFromGpao[0].nom, resultDataFromGpao[0].prenoms, matricule, resultDataFromGpao[0].passwd, role).subscribe(
                      data => {},
                      error => {},
                      () => {
                        this.toast.Success('')
                        this.listeUsers()
                      }
                    )
                  }
                
                }
              }
            )
          }
        }
      )
    }
  }

}
