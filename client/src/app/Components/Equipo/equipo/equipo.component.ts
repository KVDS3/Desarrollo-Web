import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import API_URL from 'src/apiConfig';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css'],
  standalone: false
})
export class EquipoComponent {

  API_URL = API_URL;

  facebookLink: string | null = null;
  instagramLink: string | null = null;
  

  pasatiempos: string[] = [
    'Leer',
    'Correr',
    'Cocinar',
    'Dibujar',
    'Jugar videojuegos',
    'Ver películas',
    'Escuchar música',
    'Hacer ejercicio',
    'Viajar',
    'Fotografía',
    'Jardinería',
    'Escribir',
    'Bailar',
    'Coleccionar objetos',
    'Artesanía'
  ];

  // Catálogo de géneros de música
  generosMusicales: string[] = [
    'Pop',
    'Rock',
    'Reguetón',
    'Jazz',
    'Clásica',
    'Hip-hop',
    'Electrónica',
    'Blues',
    'R&B',
    'Country',
    'Salsa',
    'Cumbia',
    'Metal',
    'Indie',
    'Reggae'
  ];
 
  equipo = {
    id_equipo: 0,
    nombre_equipo: '',
    colores: '',
    categoria: '',
    juegos_ganados: 0,
    juegos_perdidos: 0,
    cantidad_amonestaciones: 0,
    estado: '',
    nombre_dt: ''
  };

  ciudades: string[] = [
    'Aguascalientes', 'Baja California', 'Campeche', 'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos', 
    'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 
    'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];


  categoria: string = '';
  nombre_club: string = '';
  mostrarBoton: boolean = false;

  clubLogoUrl = '';
  jugador = {
    nombre_completo: '',
    fecha_nacimiento: '',
    sexo: '',
    id_equipo: '',
    nombreClub: '',
    categoria: '',
    posicion: '',
    foto: '',
    correo: '',
    anios_experiencia: 0,  // Asegúrate de que estos campos puedan ser null
    ciudad_nacimiento: '',
    peso: 0,  // Similar para peso
    estatura: 0,  // Y para estatura
    amonestaciones: 0,
    puntos_acumulados: 0,
    pasatiempos: '', // Nuevo campo
    musica_favorita: '', // Nuevo campo
    apodo: '', // Nuevo campo
    redes_sociales: {
      facebook: '',
      instagram: '',
    },
  };
  
  
  jugadorRecuperado = { nombre_completo: '', fecha_nacimiento: '', sexo: '', posicion: '', foto: '', ciudad_nacimiento: '',
  apodo: '', anios_experiencia:'', amonestaciones: '', puntos_acumulados: '', correo: '', pasatiempos: '', musica_favorita: '', redes_sociales:''
  };
  // Se usa string para manejar formato de fecha

  fotosJugadores: { [posicion: string]: string } = {};
  fotoArchivo: File | null = null;
  deportes = [
    {
      nombre: 'Fútbol',
      posiciones: ['Portero', 'Defensa', 'Defensa_izq', 'Defensa_cent', 'Defensa_der', 'Mediocampo_izq', 'Mediocampo_cent', 'Mediocampo_der', 'Delantero_izq', 'Delantero_cent', 'Delantero_der'],
  
    },
    {
      nombre: 'Fútbol Americano',
      posiciones: ['Quarterback', 'Running Back', 'Wide Receiver 1', 'Wide Receiver 2', 'Tight End', 'Lineman 1', 'Lineman 2', 'Lineman 3', 'Lineman 4', 'Lineman 5'],

    },
    {
      nombre: 'Tenis',
      posiciones: ['Titular'],

    },
    {
      nombre: 'Béisbol',
      posiciones: ['Catcher', 'Pitcher', 'Primera Base', 'Segunda Base', 'Tercera Base', 'Shortstop', 'Jardinero 1', 'Jardinero 2', 'Jardinero 3'],

    },
    {
      nombre: 'Básquet',
      posiciones: ['Base', 'Escolta', 'Alero', 'Ala-pívot', 'Pívot'],

    },
  ];
  formularioVisible = false;
  posicionSeleccionada = '';
  formularioRecuperado = false;
  posicionOcupada: boolean = false;



  constructor(private router: Router, private http: HttpClient) {}



  ngOnInit(): void {
    this.obtenerCategoriaYClub();
    this.obtenerIdUsuarioYHacerSolicitud();
    this.obtenerEquipoPorUsuario();

    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);

        if (usuario.nombre) {
          // Llamada al método para obtener la categoría
          this.obtenerCategoria(usuario.nombre);
        } else {
          console.error('El usuario no tiene un nombreUsuario asociado.');
        }

        if (usuario.id_club) {
          // Llamada al método para obtener el nombre del club
          this.obtenerNombreClub(usuario.id_club);
        } else {
          console.error('El usuario no tiene un club asociado.');
        }
      } catch (error) {
        console.error('Error al parsear el objeto usuario:', error);
      }
    } else {
      console.error('No se encontró el objeto usuario en el localStorage.');
    }

    if (this.jugadorRecuperado.redes_sociales) {
      const redes = this.jugadorRecuperado.redes_sociales.split(' - ');
      redes.forEach((red) => {
        if (red.startsWith('facebook:')) {
          this.facebookLink = 'https://facebook.com/' + red.split(':')[1].trim();
        }
        if (red.startsWith('instagram:')) {
          this.instagramLink = 'https://instagram.com/' + red.split(':')[1].trim();
        }
      });
    }
  
  }

  obtenerEquipoPorUsuario(): void {
    // Recuperar el objeto 'usuario' del localStorage
    const usuario = localStorage.getItem('usuario');
    
    if (!usuario) {
      console.error('No se encontró el objeto usuario en localStorage');
      return;
    }

    // Parsear el JSON almacenado en localStorage a un objeto JavaScript
    const usuarioObj = JSON.parse(usuario);
    const nombreUsuario = usuarioObj.nombre;

    // Obtener la URL de la API con el nombre de usuario
    const apiUrl = `${this.API_URL}/api/Ecategoria/equipoXU/${nombreUsuario}`;
    
    this.http.get<{ success: boolean, equipo: any, mensaje: string }>(apiUrl).subscribe(
      (response) => {
        if (response.success) {
          console.log('Datos del equipo:', response.equipo);

          // Llenar el objeto 'equipo' con los datos recibidos
          this.equipo = response.equipo;
        } else {
          console.error('Error: ', response.mensaje);
        }
      },
      (error) => {
        console.error('Error al obtener el equipo:', error);
      }
    );
  }


  VerificarEquipoC(): void {
    if (!this.jugador || !this.jugador.id_equipo) {
      console.error('No se encontró el id_equipo en this.jugador');
      return;
    }
  
    const id_equipo = this.jugador.id_equipo; // Obtener el id_equipo del objeto jugador
    const apiUrl = `${this.API_URL}/api/Ecategoria/equipoCompleto/${id_equipo}`;
  
    this.http.get<{ success: boolean; valido: boolean }>(apiUrl).subscribe(
      (response) => {
        if (response.success) {
          console.log('Validación completada. Resultado:', response.valido);
          if (response.valido) {
            alert('El equipo ha sido aprobado');
          } else {
            alert('El equipo ha sido aprobado');
          }
        } else {
          console.error('La validación falló:', response);
          alert('El equipo no cumple con el número necesario de jugadores.');
        }
        // Recargar la página después de mostrar la alerta
        window.location.reload(); 
      },
      (error) => {
        console.error('Error al conectar con la API:', error);
        alert('No se pudo completar la validación. Intente nuevamente.');
        // Recargar la página en caso de error
        window.location.reload(); 
      }
    );
    window.location.reload(); 
  }
  
  
  

  verificarEstadoEquipo(idEquipo: number): void {
    const apiEstadoUrl = `${this.API_URL}/api/Ecategoria/estadoEquipo/${idEquipo}`;
    this.http.get<{ success: boolean; esPendiente: boolean }>(apiEstadoUrl).subscribe(
      (response) => {
        console.log('Estado recibido:', response);
        if (response.success) {
          this.mostrarBoton = response.esPendiente;
          
        } else {
          console.error('Error en la respuesta de la API de estado de equipo');
        }
      },
      (error) => {
        console.error('Error al verificar el estado del equipo:', error);
      }
    );
  }



  obtenerCategoriaYClub(): void {
    // Recuperar el objeto 'usuario' del localStorage
    const usuario = localStorage.getItem('usuario');
  
    if (!usuario) {
      console.error('No se encontró el objeto usuario en localStorage');
      return;
    }
  
    // Parsear el JSON almacenado en localStorage a un objeto JavaScript
    const usuarioObj = JSON.parse(usuario);
    const nombre = usuarioObj.nombre;
  
    // Obtener el nombre del club directamente del objeto usuario
    this.nombre_club = usuarioObj.nombre;
  
    const apiUrl = `${this.API_URL}/api/Ecategoria/categoria-usuario/${nombre}`;
    this.http.get<{ categoria: string }>(apiUrl).subscribe(

      (response) => {
        this.categoria = response.categoria;
        console.log('Datos recibidos:', response);
  
        // Llamar al método verificarPosicionesOcupadas después de cargar los datos
        this.verificarPosicionesOcupadas();
      },
      (error) => {
        console.error('Error al obtener la categoría:', error);
      }
    );
  }
  

  verificarPosicionesOcupadas(): void {
    if (!this.categoria || !this.nombre_club) {
      console.warn('Categoría o nombre del club no disponibles todavía.');
      return;
    }
  
    const posiciones = this.deportes.find(
      (deporte) => deporte.nombre === this.categoria
    )?.posiciones;
  
    if (!posiciones) {
      console.error('No se encontraron posiciones para la categoría seleccionada.');
      return;
    }
  
    posiciones.forEach((posicion) => {
      const apiUrl = `${this.API_URL}/uploads/${this.nombre_club}/fotos/${this.categoria}/${posicion}/foto.png`;
  
      this.http.get(apiUrl, { responseType: 'blob' }).subscribe(
        (response) => {
          const fotoUrl = URL.createObjectURL(response);
          this.fotosJugadores[posicion] = fotoUrl;
          console.log(`Foto cargada para la posición ${posicion}: ${fotoUrl}`);
        },
        (error) => {
          console.warn(`No se encontró foto para la posición ${posicion}.`);
        }
      );
    });
  }
  

  verificarPosicionOcupada(): void {
    this.obtenerIdUsuarioYHacerSolicitud();
   
    const apiUrl = `${this.API_URL}/api/juga/jugador/${this.jugador.posicion}/${this.jugador.id_equipo}`;
    
    this.http.get<{ 
      success: boolean; 
      message: string; 
    }>(apiUrl).subscribe((response) => {
      if (response.success) {
        this.posicionOcupada = true;
      } else {
        this.posicionOcupada = false;
      }
      console.log('Posición ocupada:', this.posicionOcupada);
    }, (error) => {
      console.error('Error al verificar la posición:', error);
      // Opcionalmente puedes manejar errores cambiando la variable a false si lo deseas
      this.posicionOcupada = false;
    });
    
  
  }
  

  obtenerJugador(
    nombre_completo: string,
    sexo: 'M' | 'F',
    fecha_nacimiento: string,
    peso?: number,
    estatura?: number,
    apodo?: string,
    posicion?: string,
    foto?: string,
    ciudad_nacimiento?: string,
    anios_experiencia?: number,
    amonestaciones?: number,
    puntos_acumulados?: number,
    correo?: string,
    pasatiempos?: string,
    musica_favorita?: string,
    redes_sociales?: string
  ): void {
    const apiUrl = `${this.API_URL}/api/juga/jugador/${this.jugador.posicion}/${this.jugador.id_equipo}`;
    const SERVER_URL = `${this.API_URL}`;
  
    this.http.get<{
      success: boolean;
      jugador: {
        id_jugador: number;
        nombre_completo: string;
        fecha_nacimiento: string;
        sexo: 'M' | 'F';
        posicion?: string;
        foto?: string;
        ciudad_nacimiento?: string;
        apodo?: string;
        anios_experiencia?: number;
        amonestaciones?: number;
        puntos_acumulados?: number;
        correo?: string;
        pasatiempos?: string;
        musica_favorita?: string;
        redes_sociales?: string;
      }[];
    }>(apiUrl).subscribe(
      (response) => {
        // Verificamos que el arreglo 'jugador' no esté vacío
        if (response.success && response.jugador.length > 0) {
          const data = response.jugador[0]; // Tomamos el primer elemento del arreglo
          this.jugadorRecuperado = {
            nombre_completo: data.nombre_completo || '',
            fecha_nacimiento: data.fecha_nacimiento || '',
            sexo: data.sexo || '',
            posicion: data.posicion || '',
            foto: data.foto ? `${SERVER_URL}${data.foto}` : '',
            ciudad_nacimiento: data.ciudad_nacimiento || '',
            apodo: data.apodo || '',
            anios_experiencia: data.anios_experiencia?.toString() || '',
            amonestaciones: data.amonestaciones?.toString() || '',
            puntos_acumulados: data.puntos_acumulados?.toString() || '',
            correo: data.correo || '',
            pasatiempos: data.pasatiempos || '',
            musica_favorita: data.musica_favorita || '',
            redes_sociales: data.redes_sociales || ''
          };
  
          // Procesar redes sociales para extraer los enlaces
          if (this.jugadorRecuperado.redes_sociales) {
            const redes = this.jugadorRecuperado.redes_sociales.split(' - ');
            redes.forEach((red) => {
              if (red.startsWith('facebook:')) {
                const facebookUser = red.split(':')[1].trim();
                this.facebookLink = `https://facebook.com/${facebookUser}`;
              }
              if (red.startsWith('instagram:')) {
                const instagramUser = red.split(':')[1].trim();
                this.instagramLink = `https://instagram.com/${instagramUser}`;
              }
            });
          }
  
          console.log('Jugador recuperado:', this.jugadorRecuperado);
          console.log('Facebook Link:', this.facebookLink);
          console.log('Instagram Link:', this.instagramLink);
        } else {
          console.warn('No se encontró ningún jugador.');
        }
      },
      (error) => {
        console.error('Error al obtener el jugador:', error);
      }
    );
  }
  
  

  obtenerIdUsuarioYHacerSolicitud(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        const nombre = usuario.nombre;

        // Hacer la solicitud a la API con el id_usuario
        this.http.get(`${this.API_URL}/api/Ecategoria/id-equipo/${nombre}`).subscribe(
          (response: any) => {
            console.log('Respuesta de la API:', response);
            // Asignar el id_equipo a this.jugador.id_equipo
            
            if (response.success) {
              this.jugador.id_equipo = response.id_equipo; // Asigna el valor a la variable
              this.verificarEstadoEquipo(response.id_equipo)
            } else {
              console.error('No se pudo obtener el id_equipo.');
            }
          },
          (error) => {
            console.error('Error al hacer la solicitud:', error);
          }
        );
      } catch (error) {
        console.error('Error al parsear el objeto usuario:', error);
      }
    } else {
      console.error('No se encontró el objeto usuario en el localStorage.');
    }
  }

 

  obtenerCategoria(nombre: string): void {
    const apiUrl = `${this.API_URL}/api/Ecategoria/categoria-usuario/${nombre}`;
    this.http.get<{ categoria: string }>(apiUrl).subscribe(
      (response) => {
        this.jugador.categoria = response.categoria; // Asignar el valor a jugador.categoria
        this.mostrarPlantilla(response.categoria);
      },
      (error) => {
        console.error('Error al obtener la categoría:', error);
      }
    );
  }

  mostrarPlantilla(categoria: string): void {
    const formations = document.querySelectorAll('.formation-container') as NodeListOf<HTMLElement>;
    formations.forEach((formation) => {
      formation.style.display = 'none';
    });

    const formation = document.getElementById(categoria);
    if (formation) {
      formation.style.display = 'block';
    } else {
      console.error('No se encontró la plantilla para la categoría:', categoria);
    }
  }

  obtenerNombreClub(clubId: number): void {
    const apiUrl = `${this.API_URL}/api/clubes/${clubId}`;
    this.http.get<{ success: boolean; club: { nombre: string; logotipo: string } }>(apiUrl).subscribe(
      (response) => {
        if (response.success && response.club) {
          const nombreClub = response.club.nombre;
          this.clubLogoUrl = `${this.API_URL}/uploads/${nombreClub}/logotipo/${nombreClub}.png`;
          this.jugador.nombreClub = nombreClub; // Asignar el valor a jugador.nombreClub
        } else {
          console.error('Error: Club no encontrado en la respuesta.');
        }
      },
      (error) => {
        console.error('Error al obtener el nombre del club:', error);
        this.clubLogoUrl = '';
      }
    );
  }


  abrirFormulario(posicion: string): void {
    
      
    this.posicionSeleccionada = posicion;

  
    this.jugador.posicion = this.posicionSeleccionada;
  
    // Verificar si la posición está ocupada antes de abrir el formulario
    const apiUrl = `${this.API_URL}/api/juga/jugador/${this.jugador.posicion}/${this.jugador.id_equipo}`;
  
    this.http.get<{ 
      success: boolean; 
      message: string; 
    }>(apiUrl).subscribe((response) => {
      if (response.success) {
        this.posicionOcupada = true;
        this.formularioVisible = false; // No mostrar el formulario
        this.formularioRecuperado = true;
        console.log('Posición ocupada. Ejecutando obtenerJugador...');
        
        // Ejecutar obtenerJugador si la posición está ocupada
        this.obtenerJugador('nombre_completo', 'M', 'fecha_nacimiento');
      } else {
        this.posicionOcupada = false;
        this.formularioVisible = true; // Mostrar el formulario
        console.log('Posición no ocupada. Mostrando formulario...');
        
        // Asegurarse de que los valores se actualicen al abrir el formulario
        const usuarioString = localStorage.getItem('usuario');
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          
          // Obtener el id_club y el id_usuario
          if (usuario.id_club) {
            this.obtenerNombreClub(usuario.id_club);
          }
          if (usuario.id_usuario) {
            this.obtenerCategoria(usuario.id_usuario);
            this.obtenerIdUsuarioYHacerSolicitud();
          }
        }
      }
    }, (error) => {
      console.error('Error al verificar la posición:', error);
      this.posicionOcupada = false;
      this.formularioVisible = true; // Permitir abrir el formulario en caso de error
      this.obtenerCategoriaYClub();
    });
  }
  
  cerrarFormulario2(): void {
    this.formularioRecuperado = false;
    

  }

  cerrarFormulario(): void {
    this.formularioVisible = false;
    this.jugador = { nombre_completo: '', fecha_nacimiento: '', sexo: '', id_equipo: '', nombreClub: '',
    categoria: '', posicion: '', foto: '',correo: '',
    anios_experiencia: 0,
    ciudad_nacimiento: '',
    peso: 0,
    estatura: 0,
    amonestaciones: 0,
    puntos_acumulados: 0,
  apodo:'', pasatiempos: '', musica_favorita: '',     redes_sociales: {
    facebook: '',
    instagram: '',
  }, };
    this.fotoArchivo = null;
    this.obtenerIdUsuarioYHacerSolicitud();
    
  }

  cargarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fotoArchivo = input.files[0];
    }
  }

  guardarJugador(): void {
    if (!this.fotoArchivo) {
      alert('Por favor selecciona una foto.');
      return;
    }
    
  
    const fotoRuta2 = `${this.API_URL}/uploads/${this.jugador.nombreClub}/fotos/${this.jugador.categoria}/${this.jugador.posicion}/${this.fotoArchivo?.name}`;
    this.jugador.foto = fotoRuta2;  // Asigna la ruta de la foto antes de enviar los datos
    
    const redesSocialesString = `facebook:${this.jugador.redes_sociales.facebook || 'N/A'} - instagram:${this.jugador.redes_sociales.instagram || 'N/A'}`;

    const formData = new FormData();
    formData.append('nombre_completo', this.jugador.nombre_completo);
    formData.append('fecha_nacimiento', this.jugador.fecha_nacimiento);
    formData.append('sexo', this.jugador.sexo);
    formData.append('id_equipo', this.jugador.id_equipo.toString());
    formData.append('nombreClub', this.nombre_club);
    formData.append('categoria', this.categoria);
    formData.append('posicion', this.jugador.posicion);
    formData.append('foto', this.jugador.foto);
    formData.append('foto', this.fotoArchivo); // Enviar el archivo de foto también
    
    // Asegúrate de convertir los números a cadena, si es necesario
    formData.append('correo', this.jugador.correo || '');
    formData.append('anios_experiencia', this.jugador.anios_experiencia ? this.jugador.anios_experiencia.toString() : '0');  // Si es 0 o null, enviar '0'
    formData.append('ciudad_nacimiento', this.jugador.ciudad_nacimiento || ''); 
    formData.append('peso', this.jugador.peso ? this.jugador.peso.toString() : '0');  // Asegúrate de no enviar undefined o null
    formData.append('estatura', this.jugador.estatura ? this.jugador.estatura.toString() : '0');  // Similar a peso
    formData.append('amonestaciones', this.jugador.amonestaciones.toString());
    formData.append('puntos_acumulados', this.jugador.puntos_acumulados.toString());

    //////////
    formData.append('pasatiempos', this.jugador.pasatiempos || '');
    formData.append('musica_favorita', this.jugador.musica_favorita || '');
    formData.append('apodo', this.jugador.apodo || '');
    formData.append('redes_sociales', redesSocialesString); // Redes sociales como string
    ////////

    console.log('Estatura:', this.jugador.pasatiempos);
    console.log('Amonestaciones:', this.jugador.musica_favorita);
    console.log('Puntos Acumulados:', this.jugador.apodo);

    console.log('Redes_sociales:', this.jugador.redes_sociales);
  
    // Log para verificar lo que se envía
    console.log('Datos enviados al servidor:');
    console.log('Nombre Completo:', this.jugador.nombre_completo);
    console.log('Fecha de Nacimiento:', this.jugador.fecha_nacimiento);
    console.log('Sexo:', this.jugador.sexo);
    console.log('ID Equipo:', this.jugador.id_equipo);
    console.log('Foto:', this.fotoArchivo);
    console.log('nombreClub:', this.jugador.nombreClub);
    console.log('categoria:', this.jugador.categoria);
    console.log('posicion:', this.jugador.posicion);
    console.log('foto:', this.jugador.foto);
    console.log('Correo:', this.jugador.correo);
    console.log('Años de Experiencia:', this.jugador.anios_experiencia);
    console.log('Ciudad de Nacimiento:', this.jugador.ciudad_nacimiento);
    console.log('Peso:', this.jugador.peso);
    console.log('Estatura:', this.jugador.estatura);
    console.log('Amonestaciones:', this.jugador.amonestaciones);
    console.log('Puntos Acumulados:', this.jugador.puntos_acumulados);
    
    const apiUrl = `${this.API_URL}/api/juga/Cjugador`;
    this.http.post(apiUrl, formData).subscribe(
      (response: any) => {
        if (response.success) {
          const fotoRuta = `${this.API_URL}/uploads/${this.jugador.nombreClub}/fotos/${this.jugador.categoria}/${this.jugador.posicion}/${this.fotoArchivo?.name}`;
          this.fotosJugadores[this.posicionSeleccionada] = fotoRuta;
          alert('Jugador registrado exitosamente.');
          this.cerrarFormulario();
          this.verificarPosicionesOcupadas();
        } else {
          alert('Error al guardar el jugador.');
        }
      },
      (error) => {
        console.error('Error al guardar el jugador:', error);
        alert('Ocurrió un error en el servidor.');
      }
    );
  }
  
  ////////////////////////
  esBanca(posicion: string): boolean {
    return posicion.startsWith('banca');
  }
  
  obtenerPosicionesDeporte(): string[] {
    const deporte = this.deportes.find(d => d.nombre === this.categoria);
    return deporte ? deporte.posiciones : [];
  }
 
  formatDate(fechaISO: string): string {
    const date = new Date(fechaISO);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato 2 dígitos
    const day = date.getDate().toString().padStart(2, '0'); // Día en formato 2 dígitos
    return `${year}-${month}-${day}`;
  }
  

}
