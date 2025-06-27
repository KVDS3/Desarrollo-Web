// club.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import API_URI from '../../../apiConfig';

interface Club {
  id_club: number;
  nombre: string;
  correo: string;
  certificado: string;
  logotipo: string;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private apiUrl = `${API_URI}/api/club/register`; // Ruta del backend para registrar club

  constructor(private http: HttpClient) {}

  // Método para registrar un club, enviando el formulario con los archivos
  registerClub(
    nombre: string,
    correo: string,
    certificado: File,
    logotipo: File
  ): Observable<{ success: boolean; club?: Club; message?: string }> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    formData.append('certificado', certificado, certificado.name);
    formData.append('logotipo', logotipo, logotipo.name);

    return this.http.post<{ success: boolean; club?: Club; message?: string }>(
      this.apiUrl,
      formData
    ).pipe(
      map((response) => {
        if (response.success && response.club) {
          return { success: true, club: response.club };
        }
        return { success: false, message: response.message || 'Error desconocido' };
      }),
      catchError((err) => {
        console.error('Error al registrar el club:', err);
        return throwError(() => new Error('Error al registrar el club.'));
      })
    );
  }
}
