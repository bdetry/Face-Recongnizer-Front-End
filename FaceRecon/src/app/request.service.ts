import { Injectable } from '@angular/core';
import { Globals } from './../globals';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';

const httpOptions_POST = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Method' : 'POST'
  })
};

const httpOptions_GET = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Method' : 'GET'
  })
};

export interface image {
  img : String;
}

export interface modifInventory {
  subject : String;
  action : String;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http  : HttpClient,
    private globals: Globals
    ) { }

    /**
     * Send image to veify identity
     * @param img File
     */
  async identify(authInfo) {

    const res = await fetch(this.globals.server_full+'rekognition/compareFaces', authInfo);
    return await res;
  }

  getAllUsers(): Observable<string>{
    return this.http.get<string>(this.globals.server_full+'user/getUsers' ,  httpOptions_GET);
  }

  /**
   * remove from inventory
   * @param toDo add/remove
   * @param subject array value
   */
  removeFromInventory(user_id , object_id): Observable<any>
  {
    return this.http.delete<any>(this.globals.server_full+'/user/'+user_id+'/equipement/'+object_id);
  }


  /**
   * ajouter mat dans inventaire
   * @param user_id user id
   * @param object_id object id
   */
  addToInventory(user_id , object_id): Observable<any>{
    return this.http.get<any>(this.globals.server_full+'user/'+user_id+'/materiel?stockId='+object_id ,  httpOptions_GET);

  }

  /**
   * get all inventoie items
   */
  getFullInventory(): Observable<any>
  {
    return this.http.get<any>(this.globals.server_full+'materiel/all', httpOptions_GET);
  }

  /**
   * get user inventoie items
   * @param userid userId
   */
  getUserInventory(userid : number): Observable<any>
  {
    return this.http.get<any>(this.globals.server_full+'user/'+userid+'/equipement', httpOptions_GET);
  }

}
