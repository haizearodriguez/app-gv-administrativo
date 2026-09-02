import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fuente',
  templateUrl: './fuente.page.html',
  styleUrls: ['./fuente.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, 
    CommonModule,
    IonContent,
    IonButton
  ]
})
export class FuentePage {

  constructor(
    private router: Router
  ) {}

  seleccionarFuente(source: string) {

    console.log('Fuente seleccionada:', source);

    this.router.navigate(
      ['/tabs/home'],
      {
        queryParams: {
          source
        }
      }
    );
  }

}