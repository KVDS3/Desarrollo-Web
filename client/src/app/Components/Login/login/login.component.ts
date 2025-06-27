import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/Auth/auth.service';
import { RecuperaContraService } from '../../../Services/RecuperarContra/recupera-contra.service';


interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  rol: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {


  
  usuarioTemporal: Usuario | null = null;



  modoVerificacion: 'login' | 'recuperar' = 'login'; // por defecto


  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';

  captcha: string = ''; // simula que ya se resolvió

  estado: 'login' | 'recuperar' | 'codigo' | 'nueva' = 'login';

  codigo: string = '';
codigoGenerado: string = '';
contrasenaNueva: string = '';
confirmarContrasena: string = '';




  constructor(private authService: AuthService, private router: Router, private recuperaContraService: RecuperaContraService) {}

login(): void {
  if (!this.captcha) {
    this.mensaje = 'Por favor, completa el CAPTCHA.';
    return;
  }

  this.authService.login(this.correo, this.contrasena).subscribe(
    (res) => {
      if (res?.success && res.usuario) {
        // Guardas temporalmente el usuario y cambias de estado para código
        this.usuarioTemporal = res.usuario;
        this.modoVerificacion = 'login';
        this.estado = 'codigo';

        // Enviar código de verificación al correo
        this.recuperaContraService.enviarCodigo(this.correo).subscribe((res) => {
          this.codigoGenerado = res.codigo;

          this.mensaje = 'Se envió un código de verificación al correo.';
        }, () => {
          this.mensaje = 'No se pudo enviar el código de verificación.';
        });

      } else {
        this.mensaje = 'Correo o contraseña incorrectos';
      }
    },
    (error) => {
      console.error('Error en el servidor:', error);
      this.mensaje = 'Correo o contraseña incorrectos';
    }
  );
}



resolvedCaptcha(token: string) {
  this.captcha = token;
  console.log('Captcha resuelto:', token);
}

 



  enviarRecuperacion() {
  this.recuperaContraService.enviarCodigo(this.correo).subscribe({
    next: (res) => {
      if (res.success) {
        this.codigoGenerado = res.codigo; // temporalmente
        this.mensaje = 'Código enviado a tu correo';
        this.estado = 'codigo';
      } else {
        this.mensaje = res.message;
      }
    },
    error: () => this.mensaje = 'Error al enviar el correo'
  });
}

verificarCodigo() {
  if (this.codigo === this.codigoGenerado) {
    this.mensaje = 'Código verificado';

    if (this.modoVerificacion === 'recuperar') {
      this.estado = 'nueva'; // Cambiar contraseña
    } else if (this.modoVerificacion === 'login') {

      localStorage.setItem('usuario', JSON.stringify(this.usuarioTemporal));
      // Redirigir según el rol
      const rol = this.usuarioTemporal?.rol;

      if (rol === 'dt') {
        this.router.navigate(['/equipo']);
      } else if (rol === 'administrador_equipo') {
        this.router.navigate(['/administrar']);
      } else if (rol === 'administrador_sistema') {
        this.router.navigate(['/dueno']);
      }
    }

  } else {
    this.mensaje = 'Código incorrecto';
  }
}



cambiarContrasena() {
  if (this.contrasenaNueva !== this.confirmarContrasena) {
    this.mensaje = 'Las contraseñas no coinciden';
    return;
  }

  this.recuperaContraService.restablecerContrasena(this.correo, this.contrasenaNueva).subscribe({
    next: (res) => {
      this.mensaje = res.message;
      if (res.success) this.estado = 'login';
    },
    error: () => this.mensaje = 'Error al cambiar la contraseña'
  });
}
}