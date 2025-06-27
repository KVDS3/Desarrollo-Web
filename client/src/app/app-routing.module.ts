import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/Components/Login/login/login.component';
import { AuthGuard } from './guards/guards/auth.guard';
import { EquipoComponent } from './Components/Equipo/equipo/equipo.component';
import { AdministrarComponent } from './Components/Administrar/administrar/administrar.component';
import { DuenoComponent } from './Components/Dueño/dueno/dueno.component';
import { RegistrarClubComponent } from './Components/registrar-club/registrar-club/registrar-club.component';
import { InicioComponent } from './Components/inicio/inicio/inicio.component';

const routes: Routes = [
  { path: 'equipo', component: EquipoComponent, canActivate: [AuthGuard], data: { roles: ['administrador_equipo'] } },
  { path: 'administrar', component: AdministrarComponent, canActivate: [AuthGuard], data: { roles: ['administrador_equipo'] } },
  { path: 'dueno', component: DuenoComponent, canActivate: [AuthGuard], data: { roles: ['administrador_sistema'] } },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'Rclub', component: RegistrarClubComponent},
  { path: 'inicio', component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
