import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PictureComponent } from '../picture.component';

@Component({
    selector: 'picuteTakenSample',
    templateUrl: './picuteTakenSample.html',
  })
  
  export class PicuteTakenSample {
  
    constructor(
      public dialogRef: MatDialogRef<PictureComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }