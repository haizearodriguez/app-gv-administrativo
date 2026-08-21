import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Question } from '../models/question.model'
import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private temas: Record<string, Question[]> = {}
  listaTemas = [
    'Tema 1',
    'Tema 2',
    'Tema 3',
    'Tema 4',
    'Tema 5',
    'Tema 6',
    'Tema 7',
    'Tema 8',
    'Tema 9',
    'Tema 10',
    'Tema 11',
    'Tema 12',
    'Tema 13',
    'Tema 14',
    'Tema 15',
    'Tema 16',
    'Tema 17',
    'Tema 18',
    'Tema 19',
    'Tema 20',
    'Tema 21',
    'Tema 22',
    'Tema 23',
    'Tema 24',
    'Tema 25',
    'Tema 26',
    'Tema 27',
    'Tema 28',
    'Tema 29',
    'Tema 30',
    'Tema 31',
    'Tema 32',
    'Tema 33',
    'Tema 34'
  ];

  constructor(private http: HttpClient,   private storage: StorageService) {}

  async getTema(tema: string): Promise<Question[]> {

    // Si ya está cargado, lo devolvemos
    if (this.temas[tema]?.length) {
      return this.temas[tema]
    }

    const storageKey = `questions_${tema}`

    // Intentar recuperar del almacenamiento
    const stored = await this.storage.get(storageKey)

    if (stored && Array.isArray(stored)) {

      this.temas[tema] = stored.map((q: any) => ({
        ...q,
        type: tema
      }))

      return this.temas[tema]
    }

    // Cargar JSON
    const data = await firstValueFrom(
      this.http.get<Question[]>(`assets/data/${tema}.json`)
    )

    this.temas[tema] = data.map(q => ({
      ...q,
      type: tema
    }))

    // Guardar en almacenamiento
    await this.storage.set(
      storageKey,
      this.temas[tema]
    )

    return this.temas[tema]
  }

  async getCombined(): Promise<Question[]> {

    const todas: Question[] = []

    for (const tema of Object.keys(this.temas)) {
      todas.push(...this.temas[tema])
    }

    return todas
  }

  reset() {
    this.temas = {}
  }

}