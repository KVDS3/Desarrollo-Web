import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const usuario = this.authService.getUsuarioActual();

    if (usuario) {
      const allowedRoles = route.data['roles'] as Array<string>;
      if (allowedRoles && allowedRoles.includes(usuario.rol)) {
        return true;
      } else {
        this.router.navigate(['/']); // Redirigir si el rol no es permitido
        return false;
      }
    } else {
      this.router.navigate(['/']); // Redirigir si no está autenticado
      return false;
    }
  }
}
