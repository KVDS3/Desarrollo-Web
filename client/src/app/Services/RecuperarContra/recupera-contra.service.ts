import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import API_URL from 'src/apiConfig';

@Injectable({
  providedIn: 'root'
})
export class RecuperaContraService {

  private apiUrl = API_URL;

    constructor(private http: HttpClient) {}


  enviarCodigo(correo: string) {
  return this.http.post<any>(`${this.apiUrl}/api/recupera/enviar`, { correo });
}

restablecerContrasena(correo: string, contrasena: string) {
  return this.http.post<any>(`${this.apiUrl}/api/recupera/cambiar`, { correo, contrasena });
}
}
