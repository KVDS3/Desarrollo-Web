import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {

  dropdownAbierto = false;

  isLoggedIn = false;
  usuario: any = null;

  rol: string = '';

  constructor(private router: Router) {
    // Escuchar cambios en las rutas para actualizar el estado de la sesión
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // Filtrar los eventos de navegación
    ).subscribe(() => {
      this.checkUser(); // Re-verificar el estado del usuario en cada cambio de ruta
    });
  }

  ngOnInit(): void {
    this.checkUser(); // Verificar el estado al cargar el componente por primera vez
  }

  checkUser() {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser); // Suponiendo que el usuario está almacenado como un objeto JSON
      this.rol = this.usuario.rol; // <-- aquí guardas el rol
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.usuario = null;
    }
  }

  logout(): void {
    localStorage.removeItem('usuario'); // Eliminar el usuario del localStorage
    this.isLoggedIn = false;
    this.usuario = null;
    window.location.reload();
    this.router.navigate(['/']);
   
  }


}
