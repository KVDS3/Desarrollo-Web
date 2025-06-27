import { Component } from '@angular/core';
import { NavbarComponent } from "./Components/NavBar/navbar/navbar.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  standalone: false
})
export class AppComponent {
  title = 'client';

}