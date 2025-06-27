import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import API_URL from 'src/apiConfig';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  API_URL = API_URL; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  // Listar solicitudes de clubes
  listarSolicitudes(): Observable<any> {
    return this.http.get(`${this.API_URL}/api/Admin/solicitudes`);
  }

  // Aprobar un club
  aprobarClub(id_club: number): Observable<any> {
    return this.http.post(`${this.API_URL}/api/Admin/aprobar/${id_club}`, {});
  }

  // Eliminar un club
  eliminarClub(id_club: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/api/Admin/eliminar/${id_club}`);
  }
}
