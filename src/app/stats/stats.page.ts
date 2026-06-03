import { QuestionService } from './../services/question.service';
import { Component, OnInit } from '@angular/core'
import { StatsService } from 'src/app/services/stats.service'
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonButton, IonCard, IonCardContent } from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonCard, FormsModule, IonContent, IonRow, IonGrid, IonCol, IonCheckbox, IonButton]

})
export class StatsPage implements OnInit {



  stats: any[] = []
  reviewed: any[] = []
  pending: any[] = []
  allPendingSelected = false


  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumnPending: string = '';
  sortDirectionPending: 'asc' | 'desc' = 'asc';

  constructor(
    private statsService: StatsService,
    private questionService: QuestionService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.loadStats()
  }

  async ionViewWillEnter() {
    await this.loadStats()
  }

  async loadStats() {
    const statsObj = await this.statsService.getStats()
    const allQuestions = await this.questionService.getCombined()

    this.reviewed = Object.values(statsObj).map((s: any) => ({
      ...s,
      selected: false
    }))

    const statsKeys = new Set(Object.keys(statsObj))

    this.pending = allQuestions
      .filter((q: any) => !statsKeys.has(`${q.id}_${q.type}`))
      .map((q: any) => ({
        ...q,
        selectedPending: false
      }))
  }

  accuracy(s: any) {
    if (!s.attempts) return 0
    return Math.round((s.correct / s.attempts) * 100)
  }

  async generateQuiz() {
    const selected = [
      ...this.reviewed.filter(s => s.selected),
      ...this.pending.filter(s => s.selectedPending)
    ].map(s => ({ id: s.id, type: s.type }))

    if (selected.length === 0) {
      const alert = await this.alertController.create({
        header: 'Aviso',
        message: 'Selecciona al menos una pregunta',
        buttons: ['OK']
      })
      await alert.present()
      return
    }

    this.router.navigate(['/tabs/quiz'], {
      state: { questions: selected }
    })
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortColumn = column
      this.sortDirection = 'asc'
    }

    this.reviewed.sort((a, b) => {
      let valueA = column === 'accuracy' ? this.accuracy(a) : a[column]
      let valueB = column === 'accuracy' ? this.accuracy(b) : b[column]
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  getSortIcon(column: string) {
    if (this.sortColumn !== column) return ''
    return this.sortDirection === 'asc' ? '↑' : '↓'
  }

  sortPending(column: string) {
    if (this.sortColumnPending === column) {
      this.sortDirectionPending = this.sortDirectionPending === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortColumnPending = column
      this.sortDirectionPending = 'asc'
    }

    this.pending.sort((a, b) => {
      let valueA = a[column]
      let valueB = b[column]
      if (valueA < valueB) return this.sortDirectionPending === 'asc' ? -1 : 1
      if (valueA > valueB) return this.sortDirectionPending === 'asc' ? 1 : -1
      return 0
    })
  }

  getSortIconPending(column: string) {
    if (this.sortColumnPending !== column) return ''
    return this.sortDirectionPending === 'asc' ? '↑' : '↓'
  }

  toggleAllPending(event: any) {
    const checked = event.detail.checked
    this.pending.forEach(s => s.selectedPending = checked)
  }

}