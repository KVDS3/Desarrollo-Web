import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/Components/Login/login/login.component';
import { AuthGuard } from './guards/guards/auth.guard';
import { EquipoComponent } from './Components/Equipo/equipo/equipo.component';
import { AdministrarComponent } from './Components/Administrar/administrar/administrar.component';
import { DuenoComponent } from './Components/Dueño/dueno/dueno.component';
import { RegistrarClubComponent } from './Components/registrar-club/registrar-club/registrar-club.component';
import { InicioComponent } from './Components/inicio/inicio/inicio.component';

import { DashboardComponent} from './Components/Dashboards/dashboard/dashboard.component';
import { LayoutComponent } from './Components/Layout/layout/layout.component';

import { GestionEquiposComponent} from './Components/PaginasDashboard/gestion-equipos/gestion-equipos.component';
import { GestionJugadoresComponent} from './Components/PaginasDashboard/gestion-jugadores/gestion-jugadores.component';
import { GestionPerfilComponent} from './Components/PaginasDashboard/gestion-perfil/gestion-perfil.component';
import { GestionSistemaComponent} from './Components/PaginasDashboard/gestion-sistema/gestion-sistema.component';

import { MapaSitioComponent} from './Components/mapa-sitio/mapa-sitio.component';

const routes: Routes = [
  { path: 'equipo', component: EquipoComponent, canActivate: [AuthGuard], data: { roles: ['administrador_equipo'] } },
  { path: 'administrar', component: AdministrarComponent, canActivate: [AuthGuard], data: { roles: ['administrador_equipo'] } },
  { path: 'dueno', component: DuenoComponent, canActivate: [AuthGuard], data: { roles: ['administrador_sistema'] } },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'Rclub', component: RegistrarClubComponent},
  { path: 'inicio', component: InicioComponent},
  { path: 'Dashboar', component: DashboardComponent},
  { path: 'mapa-sitio', component: MapaSitioComponent},
   
 {
  path: 'dashboard',
  component: LayoutComponent, 
  canActivate: [AuthGuard], 
  data: { 
    roles: ['administrador_sistema'],
    breadcrumb: 'Perfil' // Cambiado de 'Dashboard' a 'Perfil'
  },
  children: [
    { 
      path: 'Equipos', 
      component: GestionEquiposComponent,
      data: { 
        breadcrumb: 'Equipos',
        parentBreadcrumb: 'Perfil' // Nueva propiedad para relación jerárquica
      }
    },
    { 
      path: 'Jugadores', 
      component: GestionJugadoresComponent,
      data: { 
        breadcrumb: 'Jugadores',
        parentBreadcrumb: 'Perfil'
      }
    },
    { 
      path: 'Perfil', 
      component: GestionPerfilComponent,
      data: { 
        breadcrumb: null, // Null para que no se duplique
        hideParent: true // Oculta el breadcrumb padre en esta ruta
      }
    },
    { 
      path: 'Sistema', 
      component: GestionSistemaComponent,
      data: { 
        breadcrumb: 'Sistema',
        parentBreadcrumb: 'Perfil'
      }
    },
    { 
      path: 'Club', 
      component: DuenoComponent,
      data: { 
        breadcrumb: 'Club',
        parentBreadcrumb: 'Perfil'
      }
    },
    { 
      path: '', 
      redirectTo: 'Perfil', 
      pathMatch: 'full',
      data: { 
        breadcrumb: null, // Null para redirección
        hideParent: true
      }
    }
  ]
},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
