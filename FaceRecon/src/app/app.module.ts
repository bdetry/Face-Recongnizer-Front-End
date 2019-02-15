import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PictureComponent } from './picture/picture.component';
import { PicuteTakenSample } from './picture/PicuteTakenSample/picturetakensample.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';


import { RequestService } from './request.service';
import { Globals } from './../globals'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    InventoryComponent,
    PictureComponent,
    PicuteTakenSample
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ],
  entryComponents : [PicuteTakenSample],
  providers: [
    RequestService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
