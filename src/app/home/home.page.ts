import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonContent, FormsModule, RouterLink, IonIcon]
})
export class HomePage implements OnInit {

  // Añade aquí todos los temas que vayas a tener
  temas = [
    'tema1',
    'tema2',
    'tema3',
    'tema4',
    'tema5',
    'tema6',
    'tema7',
    'tema8',
    'tema9',
    'tema10',
    'tema11',
    'tema12',
    'tema13',
    'tema14',
    'tema15',
    'tema16',
    'tema17',
    'tema18',
    'tema19',
    'tema20',
    'tema21',
    'tema22',
    'tema23',
    'tema24',
    'tema25',
    'tema26',
    'tema27',
    'tema28',
    'tema29',
    'tema30',
    'tema31',
    'tema32',
    'tema33',
    'tema34'
  ];

  ivap = [
    {
      id: 'ivap-general-2026',
      nombre: 'IVAP GENERAL 2026'
    },
    {
      id: 'ivap-administrativo-2022',
      nombre: 'IVAP ADMINISTRATIVO 2022'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  getNombreTema(tema: string): string {
    return tema.replace('tema', 'Tema ');
  }

}
