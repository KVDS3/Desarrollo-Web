import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../Services/Admin/admin.service';


@Component({
  selector: 'app-dueno',
  templateUrl: './dueno.component.html',
  styleUrls: ['./dueno.component.css'],
  standalone: false
})
export class DuenoComponent implements OnInit {
  solicitudes: any[] = []; // Lista de solicitudes de clubes
  mensaje: string = '';   // Mensaje para notificaciones

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes(): void {
    this.adminService.listarSolicitudes().subscribe({
      next: (data) => {
        // Si es un solo objeto, conviértelo en un arreglo
        this.solicitudes = Array.isArray(data) ? data : [data];
      },
      error: (err) => this.mensaje = 'Error al obtener las solicitudes de clubes.'
    });
  }
  

  // Aprobar un club
  aprobarClub(id_club: number): void {
    this.adminService.aprobarClub(id_club).subscribe({
      next: () => {
        this.mensaje = 'Club aprobado exitosamente.';
        this.obtenerSolicitudes(); // Refrescar la lista
      },
      error: (err) => this.mensaje = 'Error al aprobar el club.'
    });
  }

  // Eliminar un club
  eliminarClub(id_club: number): void {
    this.adminService.eliminarClub(id_club).subscribe({
      next: () => {
        this.mensaje = 'Club eliminado exitosamente.';
        this.obtenerSolicitudes(); // Refrescar la lista
      },
      error: (err) => this.mensaje = 'Error al eliminar el club.'
    });
  }
}
