import { Component, OnInit } from '@angular/core';
import { RequestService } from './../request.service';
import { Router } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  public instruments ;
  public InstruIds : Array<string> = new Array<string>();
  public Userinstruments;
  public userInstruIds: Array<string> = new Array<string>();
  public user = null;

  public dataImg;

  constructor(private requestService : RequestService , private router : Router , private _sanitizer: DomSanitizer) {  }

  ngOnInit() {
    isNaN(parseInt(localStorage.getItem('connectedUserId') ) )?   this.router.navigateByUrl('/home') : this.setUser();
    this.requestService.getFullInventory().subscribe((x)=>{
      this.instruments = x;
      x.forEach(element => {
        this.InstruIds.push(element.id);
        
      });
      
      //set full invt
    });

    if(localStorage.getItem('connectedUserId')!=null){
      this.requestService.getUserInventory(this.user.id).subscribe((x)=>{
        this.Userinstruments = x;
        x.forEach(element => {
          this.userInstruIds.push(element.stock.id);
        });
      })

      this.user.nom = localStorage.getItem('connectedUserLastName');
      this.user.prenom = localStorage.getItem('connectedUserName');
    }

    this.setProfilePic(localStorage.getItem('connectedUserImg'));

  }


  setProfilePic(img){
    this.dataImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    + img);
  }

  /**
   * modify user inventory
   * @param toDo add/remove
   * @param subject array value
   */
  modif(event : any , subject : any){
    switch(event.target.checked){

      case false:
    
      let idToRemove : number;
      this.Userinstruments.forEach(element => {
        
        if(element.stock.id == subject.id){
          this.requestService.removeFromInventory(localStorage.getItem('connectedUserId') , element.id).subscribe((x)=>{
            this.requestService.getUserInventory(this.user.id).subscribe((x)=>{
              this.Userinstruments = x;
              x.forEach(element => {
                let userInstruIds = null;
                this.userInstruIds.push(element.stock.id);
              });
            })
           } , (err)=>console.log(err));
        }

      });       

      break;

      case true:      
      this.requestService.addToInventory(localStorage.getItem('connectedUserId') , subject.id).subscribe((x)=>{

        subject.stock = { id :  subject.id , name : subject.name , quantity : subject.quantity}        

          this.requestService.getUserInventory(this.user.id).subscribe((x)=>{
            this.Userinstruments = x;            
            x.forEach(element => {
              let userInstruIds = null;
              this.userInstruIds.push(element.stock.id);
            });
          })


      } , (err)=>console.log(err));

      break;

    }
  }

  /**
   * Verofie si l utilisqteur a ou pas un mateiaux
   * @param id Id de l instrumenet
   */
  userHaveItem(id){
    return this.userInstruIds.includes(id);
  }

  /**
   * recupere l'utilisateur du local storage et l'initialie
   */
  setUser(){
    this.user = {id : localStorage.getItem('connectedUserId') , nom :  localStorage.getItem('connectedUserName'),prenom :  localStorage.getItem('connectedUserLastName'),image :  localStorage.getItem('connectedUserImg')}
  }

  /**
   * Log out user
   */
  destroySes(){
    localStorage.removeItem('connectedUserId');
    localStorage.removeItem('connectedUserName');
    localStorage.removeItem('connectedUserLastName');
    localStorage.removeItem('connectedUserImg');
    this.router.navigateByUrl('/home');
  }

}
