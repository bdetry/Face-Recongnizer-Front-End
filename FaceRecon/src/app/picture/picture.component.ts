import { Component, OnInit , ViewChild, Inject } from '@angular/core';

import { RequestService } from './../request.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { PicuteTakenSample } from './PicuteTakenSample/picturetakensample.component';


@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  @ViewChild('videoElement') videoElement: any;
  video: any = null;
  canvas : any;
  public allUsers : any = null;
  public selectedUserId : number = null;
  private videoWidth : Number;
  private videoHeight : Number;

  public videoHere : boolean = false;

  constructor(private requestSer : RequestService ,
    private router : Router,
    private snackBar : MatSnackBar,
    public dialog: MatDialog,
    private sanitazer : DomSanitizer) { }

  ngOnInit() {
    this.canvas = document.getElementById("c");
    this.video = this.videoElement.nativeElement;
    
    this.initCamera({ video: true, audio: false });
    this.requestSer.getAllUsers().subscribe(x => this.allUsers = x , (err)=> this.openSnackBar("Imposible de recuper les utilisateurs"));
  }



  /**
   * Start the camera
   * @param config camera config
   */
  initCamera(config:any) {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.videoWidth = stream.getVideoTracks()[0].getSettings().width;
      this.videoHeight = stream.getVideoTracks()[0].getSettings().height;
      this.video.srcObject = stream;
      this.video.play();
      this.videoHere = true;
      
    });
  }

  /**
   * take picture from camera
   */
  takeSnap(){
    this.canvas.height = this.videoHeight;
    this.canvas.width = this.videoWidth;
    this.canvas.getContext("2d").drawImage(this.video,  0, 0  , this.videoWidth,  this.videoHeight, 0, 0, this.videoWidth, this.videoHeight);
    this.canvas.toBlob((res)=>{
      let img: Blob ;
      img = res;
      if(this.selectedUserId!=null){
        this.showJustTaken(img);
      }else{
        this.openSnackBar("Qui est tu?");
      }
      
      if (this.selectedUserId!=null) {

        let authInfo = {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": '*'
          }
        };  
        
        let t = new FormData();
        t.set("image", img);
        t.set('id', this.selectedUserId.toString());

        authInfo = Object.assign({}, authInfo, {body: t})
        
        this.requestSer.identify(authInfo)
        .then((res) => res.json())
        .then(data=>{this.setSession(data)} , err => {
          this.openSnackBar("Erreur interne du serveur");
        })

      }
    }, 'image/jpeg', 1);

  }

  /**
   *Send the just taken Blob to the just taken popo in
   * @param blob blob de l'image juste prise
  */
  showJustTaken(blob : any){
    let img :any = new File([blob], "name");
    var objectURL = URL.createObjectURL(blob);
    this.openDialog(this.sanitazer.bypassSecurityTrustUrl(objectURL));      
  }

 /**
  * Set l'user choissit par l'utilisateur dans la liste deroulante
  * @param id id du user choisit
  */
  selectedUser(id : number){
    this.selectedUserId = id;
  }


  /**
   * Verifie la reponse du serveur apres l'evoi d'image 
   * Cree ou pas des local storages
   * @param res Reponse du serveur apres tentative d'authentification
   */
  setSession(res){
    if(res.id!=null){
      if(!isNaN(res.id)){
        localStorage.setItem('connectedUserId', res.id);
        localStorage.setItem('connectedUserName', res.prenom);
        localStorage.setItem('connectedUserLastName', res.nom);
        localStorage.setItem('connectedUserImg', res.image.image);
        this.dialog.closeAll();
        this.router.navigateByUrl('/inventory');
      }      
    }else{
      this.openSnackBar("Utilisateur inconnue");
    }

  }


  /**
   * Ouvrir Snack bar en cas d'erreur
   */
  openSnackBar(msg : string) {
    this.snackBar.open(msg , "Ok", {
      duration: 20000,
    });
}

  /**
   * Ouvrir pop-in
   * @param datas datas to store i pop in
   */
  openDialog(datas : any): void {
    const dialogRef = this.dialog.open(PicuteTakenSample, {
      width: '250px',
      data: datas
    });
  }


}
