import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastService } from '../services/toast/toast.service';
import { MenuService } from '../services/menu/menu.service';
import { CryptageService } from '../services/cryptage/cryptage.service';
import { AccueilService } from '../services/accueil/accueil.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  
  constructor(private router:Router, private cookies:CookieService, private toast:ToastService, private cryptageService:CryptageService, private acceuilService:AccueilService, private modalService : NgbModal) { 
    sessionStorage.setItem('currentUrl', this.cryptageService.encryptValue(this.router.url)) 
  }

  cookie:any = JSON.parse(this.cryptageService.decryptValue(this.cookies.get("data_utilisateur")))
  role:any = this.cookie.role

  date_debut:any
  date_fin:any
  list_type_control:any
  ListLivraison:any=[]
  filteredListLivraison: any = []
  type_acte:any
  List_type_acte:any
  countAttente:any = 0
  countEncours:any = 0
  countReserver:any = 0
  countTerminer:any = 0
  ngOnInit(): void { 
    this.filter_suivi(this.date_debut,this.date_fin)
    this.GetTypeControl()
    this.GetTypeActe()
  }

  resetFilter(){
    this.date_debut = undefined
    this.date_fin = undefined
    this.type_acte = undefined
    this.selectedStatus = null;
    this.filter_suivi(this.date_debut,this.date_fin)
  }
id_livrable:any
test:any=[]
filter_suivi(date_debut: string, date_fin: string) {
  var obj = { date_debut, date_fin };
  this.acceuilService.getLivraison(obj).subscribe(data => {
    this.ListLivraison = data;
    console.log(data)
    this.updateCounts();
    this.ListLivraison.forEach(item => {
      item.decision_exhaustivite = item.commentaire_exhaustivite === 'VALIDE' ? 'VALIDE' : 'REJETE';
      item.decision_structure = item.commentaire_structure === 'VALIDE' ? 'VALIDE' : 'REJETE';
      item.decision_validite = item.commentaire_validite === 'VALIDE' ? 'VALIDE' : 'REJETE';
      item.decision_exhaustivite = item.commentaire_exhaustivite === 'VALIDE' ? 'VALIDE' : 'REJETE';
      item.decision_structure = item.commentaire_structure === 'VALIDE' ? 'VALIDE' : 'REJETE';
      item.decision_validite = item.commentaire_validite === 'VALIDE' ? 'VALIDE' : 'REJETE';
      item.controle_exhaustivite = (item.decision_exhaustivite === 'REJETE' || item.decision_structure === 'REJETE' || item.decision_validite === 'REJETE') ? 'REJETE' : 'VALIDE';

      item.nom_control = item.type_control === '1' ? 'REDUIT' : item.type_control === '2' ? 'NORMAL' : item.type_control === 'RENFORCE' ? 'RENFORCE' : undefined;

      if(item.decision === 'R'){
        console.log("id_livrable rejeté : ", item.id_livrable)
      }
    })
    this.applyFilter();
  });
}
echantillonError:any=[]
selectedItem: any;

private processEchantillon(item: any, data: any): any {
  let nbr_unite_non_conforme = 0;
  data.forEach(it => {
    it.echantillon.forEach(item => {
      item.nom_typage = item.num_typage1 === 0 ? 'NAISSANCE' : item.num_typage1 === 1 ? 'RECONNAISSANCE' : item.num_typage1 === 2 ? 'JUGEMENT' : 'AUTRE';
    });
    it.unite_non_conforme = it.errors.length > 0 ? 1 : 0;
    it.nbr_faute = it.unite_non_conforme;
    it.liste_faute = it.errors.length === 0 ? 'vide' : it.errors.some(itemError => Array.isArray(itemError.type_erreur) && itemError.type_erreur.length === 0) ? 'vide' : it.errors.map(itemError => itemError.type_erreur);
    nbr_unite_non_conforme += it.unite_non_conforme;
  });
  item.nbr_unite_non_conforme = nbr_unite_non_conforme;
  item.controle_echantillonne = item.nbr_unite_non_conforme > item.seuil_acceptation ? 'REJETE' : 'VALIDE';
  return data;
}

selectItem(item: any): void {
  this.selectedItem = item;
  const id_livrable = { id_livrable: item.id_livrable };
  this.acceuilService.getEchantillon(id_livrable).subscribe(data => {
    this.echantillonError = data;
    console.log(this.echantillonError);
    this.processEchantillon(item, data);
  });
}

reprise:any=[];
select:any;
showModal = false;
selectItemReprise(item:any){
  this.select = item;
  const id_livrable = { id_livrable: item.id_livrable };
  console.log(id_livrable)
  this.acceuilService.getReprise(id_livrable).subscribe(data => {
    this.reprise = data;
    console.log(this.reprise);
    if(this.reprise.length === 0){
      this.toast.Warning('liste reprise vide')
      this.showModal = false;
    } else {
      this.showModal = true;
    }
  })
}

saveDownload(item: any): void {
  this.selectedItem = item;
  this.selectItem(item);
  const id_livrable = { id_livrable: item.id_livrable };
  this.acceuilService.getEchantillon(id_livrable).subscribe((data:any) => {
    this.echantillonError = this.processEchantillon(item,data);
    const dataToExport = this.prepareData();
    console.log('Data to export:', dataToExport);
    this.acceuilService.exportAsExcelFile(dataToExport).subscribe(response => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BCQ_PRODIGY_export_${new Date().getTime()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  });
}

prepareData(): any {
  const selectedItem = this.selectedItem;

  const mainData = {
    nom_livrable: selectedItem.nom_livrable,
    nb_lot: selectedItem.nb_lot,
    nb_acte: selectedItem.nb_acte,
    date_controle: selectedItem.date_controle,
    date_debut: selectedItem.date_debut,
    date_fin: selectedItem.date_fin,
    matricule_controleur: selectedItem.matricule_controleur,
    decision_validite: selectedItem.decision_validite,
    decision_structure: selectedItem.decision_structure,
    decision_exhaustivite: selectedItem.decision_exhaustivite,
    commentaire_validite: selectedItem.commentaire_validite,
    commentaire_structure: selectedItem.commentaire_structure,
    commentaire_exhaustivite: selectedItem.commentaire_exhaustivite,
    taille_echantillon: selectedItem.taille_echantillon,
    nom_control: selectedItem.nom_control,
    seuil_acceptation: selectedItem.seuil_acceptation,
    controle_exhaustivite: selectedItem.controle_exhaustivite,
    controle_echantillonne: selectedItem.controle_echantillonne,
    nbr_unite_non_conforme: selectedItem.nbr_unite_non_conforme,
    echantillonError : this.echantillonError
  };

  return mainData;
}

totalcount:any=0
updateCounts() {
    this.countAttente = 0;
    this.countEncours = 0;
    this.countReserver = 0;
    this.countTerminer = 0;
    for (const item of this.ListLivraison) {
        item.seuil_acceptation = parseInt(item.seuil_acceptation);
        switch (item.etat) {
            case '1':
                item.lib_etat = 'En Attente';
                this.countAttente++;
                break;
                case '2':
                  item.lib_etat = 'Exhaustivité';
                  this.countEncours++;
                  break;
                  case '3':
                    item.lib_etat = 'Echantillonage';
                    this.countReserver++;
                    break;
                    case '4':
                item.lib_etat = 'Terminé';
                this.countTerminer++;
                break;
            default:
                break;
        }
    }
    this.totalcount= this.countAttente + this.countEncours + this.countReserver + this.countTerminer;
}

selectedStatus: string | null = null;
applyFilter() {
  if (this.selectedStatus === null) {
      this.filteredListLivraison = this.ListLivraison;
  } else {
      this.filteredListLivraison = this.ListLivraison.filter(item => item.etat == this.selectedStatus);
  }
  if (this.selectedStatus === '4') {
    this.filteredListLivraison.sort((a, b) => this.compareDates(a.date_controle, b.date_controle));
  }
}
parseDate(dateStr: string): Date {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

compareDates(date1: string, date2: string): number {
  const d1 = this.parseDate(date1);
  const d2 = this.parseDate(date2);
  return d2.getTime() - d1.getTime();
}

filterByStatus(status: string) {
  if (this.selectedStatus === status) {
      this.selectedStatus = null;
  } else {
      this.selectedStatus = status;
  }
  this.applyFilter();
}

  GetTypeControl(){
    this.acceuilService.getTypeControl().subscribe(
      data =>{
        this.list_type_control = data
      }
    )
  }

  check(id,check,index){
    var indexAvant = index - 1
    if(id == 1){
      this.ListLivraison[index].decision = 'V'
      if(indexAvant == -1){
        this.ListLivraison[index].score_passage = 3
      }else{
        this.ListLivraison[index].score_passage = this.ListLivraison[indexAvant].score_passage + 3
      }
    }else if(id == 2){
        this.ListLivraison[index].decision = 'R'
        this.ListLivraison[index].score_passage = 0
    }
  }

  GetTypeActe(){
    // this.acceuilService.getListTypage().subscribe(data=>{
    //   this.List_type_acte = data
    //   this.List_type_acte.forEach(item => {console.log(item.libelle_typage_fr , "=", item.num_typage)})
    // })
  }
  
  
  



}
