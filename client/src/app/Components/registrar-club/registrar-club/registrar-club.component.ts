import { Component } from '@angular/core';
import { ClubService } from '../../../Services/registrar-club/registrar-club.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registrar-club',
  templateUrl: './registrar-club.component.html',
  standalone: false
})
export class RegistrarClubComponent {
  nombre: string = '';
  correo: string = '';
  certificado: File | null = null;
  logotipo: File | null = null;
  captcha: string = '';


  constructor(private clubService: ClubService) {}

  // Manejar cambio de archivo para certificado
  onCertificadoChange(event: any): void {
    this.certificado = event.target.files[0];
  }

  // Manejar cambio de archivo para logotipo
  onLogotipoChange(event: any): void {
    this.logotipo = event.target.files[0];
  }

  resolvedCaptcha(token: string) {
  this.captcha = token;
  console.log('Captcha resuelto:', token);
}


  onSubmit(form: NgForm): void {
  if (form.invalid || !this.certificado || !this.logotipo || !this.captcha) {
    alert('Formulario inválido. Revisa los campos.');
    return;
  }

  this.clubService
    .registerClub(this.nombre, this.correo, this.certificado, this.logotipo)
    .subscribe({
      next: (response) => {
        if (response.success) {
          alert('Club registrado exitosamente!');
        } else {
          alert(`Error: ${response.message}`);
        }
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Hubo un error al registrar el club.');
      },
    });
}

}
