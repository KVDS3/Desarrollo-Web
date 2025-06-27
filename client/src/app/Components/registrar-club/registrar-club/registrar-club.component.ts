import { Component, AfterViewInit } from '@angular/core';
import { ClubService } from '../../../Services/registrar-club/registrar-club.service';
import { NgForm } from '@angular/forms';
import { VerificaCorreoService } from '../../../Services/VerificaCorreo/verifica-correo.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-registrar-club',
  templateUrl: './registrar-club.component.html',
  styleUrls: ['./registrar-club.component.css']
})
export class RegistrarClubComponent implements AfterViewInit {
  nombre: string = '';
  correo: string = '';
  certificado: File | null = null;
  logotipo: File | null = null;
  captcha: string = '';
  correoValido: boolean | null = null;

  constructor(
    private clubService: ClubService,
    private verificaCorreoService: VerificaCorreoService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  onCertificadoChange(event: any): void {
    const file = event.target.files[0];
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];

    if (file) {
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Formato no válido',
          text: 'Solo se permite subir archivos PDF, PNG o JPG para el certificado.',
          allowOutsideClick: false
        });
        this.certificado = null;
        event.target.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo demasiado grande',
          text: 'El archivo del certificado supera el tamaño máximo de 2MB.',
          allowOutsideClick: false
        });
        this.certificado = null;
        event.target.value = '';
        return;
      }

      this.certificado = file;
    }
  }

  onLogotipoChange(event: any): void {
    const file = event.target.files[0];
    const validTypes = ['image/png'];

    if (file) {
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Formato no válido',
          text: 'Solo se permite subir imágenes PNG para el logotipo.',
          allowOutsideClick: false
        });
        this.logotipo = null;
        event.target.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo demasiado grande',
          text: 'El archivo del logotipo supera el tamaño máximo de 2MB.',
          allowOutsideClick: false
        });
        this.logotipo = null;
        event.target.value = '';
        return;
      }

      this.logotipo = file;
    }
  }

  resolvedCaptcha(token: string) {
    this.captcha = token;
  }

  verificarCorreoEnTiempoReal() {
    if (!this.correo) return;

    this.verificaCorreoService.verificarCorreo(this.correo).subscribe({
      next: (res) => {
        const formato = res.is_valid_format?.value ?? false;
        const smtp = res.is_smtp_valid?.value ?? false;
        const mx = res.is_mx_found?.value ?? false;

        this.correoValido = formato && smtp && mx;
      },
      error: () => {
        this.correoValido = false;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos.',
        allowOutsideClick: false
      });
      return;
    }

    if (!this.certificado) {
      Swal.fire({
        icon: 'error',
        title: 'Certificado faltante',
        text: 'Debes subir el certificado del club.',
        allowOutsideClick: false
      });
      return;
    }

    if (!this.logotipo) {
      Swal.fire({
        icon: 'error',
        title: 'Logotipo faltante',
        text: 'Debes subir el logotipo del club.',
        allowOutsideClick: false
      });
      return;
    }

    if (!this.captcha) {
      Swal.fire({
        icon: 'error',
        title: 'CAPTCHA requerido',
        text: 'Por favor completa el CAPTCHA para continuar.',
        allowOutsideClick: false
      });
      return;
    }

    this.clubService
      .registerClub(this.nombre, this.correo, this.certificado, this.logotipo)
      .subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire({
              title: '¡Registro en proceso!',
              text: 'Espera la respuesta a tu correo',
              icon: 'success',
              allowOutsideClick: false,
              confirmButtonText: 'Ir a Iniciar Sesión',
              showCancelButton: false,
              showCloseButton: false
            }).then(() => {
              this.router.navigate(['/login']); // Ajusta esta ruta según tu aplicación
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error en el registro',
              text: response.message || 'Ocurrió un error al registrar el club.',
              allowOutsideClick: false
            });
          }
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Ocurrió un error al comunicarse con el servidor.',
            allowOutsideClick: false
          });
        }
      });
  }
}