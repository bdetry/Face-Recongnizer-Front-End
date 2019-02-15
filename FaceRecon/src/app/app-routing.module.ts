import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component'; 

const routes: Routes = [
  {path : 'home', component: HomeComponent }, // can activate because router.navigate in controller if loggedin
  {path : '', component: HomeComponent },
  {path : 'inventory', component: InventoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
