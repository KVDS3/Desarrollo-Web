// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import API_URL from 'src/apiConfig';


interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_club: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${API_URL}/api/auth/login`;
  private usuario: Usuario | null = null;

  constructor(private http: HttpClient) {}

  login(correo: string, contraseña: string): Observable<{ success: boolean; usuario: Usuario | null }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { correo, contraseña };

    return this.http.post<{ success: boolean; usuario?: Usuario }>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        if (response.success && response.usuario) {
          this.setUsuario(response.usuario);
          return { success: true, usuario: response.usuario };
        }
        return { success: false, usuario: null };
      }),
      catchError((err) => {
        console.error('Error de autenticación:', err);
        return throwError(() => new Error('Error en la autenticación.'));
      })
    );
  }

  setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioActual(): Usuario | null {
    if (!this.usuario) {
      this.usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    }
    return this.usuario;
  }

  logout(): void {
    this.usuario = null;
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return !!this.getUsuarioActual();
  }
}
