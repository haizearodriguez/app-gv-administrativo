import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ]
})
export class HomePage implements OnInit {

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

  source = 'all';

  nombreFuente = 'Todas las fuentes';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {

      this.source =
        params.get('source') || 'all';

      this.actualizarNombreFuente();

    });

  }

  actualizarNombreFuente() {

    switch (this.source) {

      case 'examen-2022':
        this.nombreFuente = 'Examen 2022';
        break;

      case 'bateria-2026':
        this.nombreFuente = 'Batería 2026';
        break;

      case 'chatgpt':
        this.nombreFuente = 'ChatGPT';
        break;

      default:
        this.nombreFuente = 'Todas las fuentes';
        break;
    }

  }

  empezarTema(tema: string) {

    console.log('Tema:', tema);
    console.log('Fuente:', this.source);

    this.router.navigate(
      ['/tabs/quiz'],
      {
        queryParams: {
          mode: tema,
          source: this.source
        }
      }
    );

  }

  cambiarFuente() {

    this.router.navigate(
      ['/tabs/fuente']
    );

  }

  getNombreTema(tema: string): string {

    return tema.replace(
      'tema',
      'Tema '
    );

  }

}