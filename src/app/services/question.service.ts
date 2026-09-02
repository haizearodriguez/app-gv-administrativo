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

  readonly sources: string[] = [
    'examen-2022',
    'bateria-2026',
    'chatgpt'
  ]

  listaTemas = [
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
  ]

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  /*
   * CARGAR UN TEMA
   *
   * Carga automáticamente las 3 fuentes:
   * - examen-2022
   * - bateria-2026
   * - chatgpt
   */
  async getTema(
    tema: string,
    source: string = 'all'
  ): Promise<Question[]> {

    const cacheKey =
      `questions_v3_${tema}_${source}`

    const stored =
      await this.storage.get(cacheKey)

    if (stored && Array.isArray(stored)) {
      this.temas[cacheKey] = stored
      return stored
    }

    const fuentes =
      source === 'all'
        ? this.sources
        : [source]

    const todas: Question[] = []

    for (const fuente of fuentes) {

      const path =
        `assets/data/${tema}/${fuente}.json`

      try {

        const data =
          await firstValueFrom(
            this.http.get<Question[]>(path)
          )

        const preguntas =
          data.map(q => ({
            ...q,
            type: tema,
            source: fuente
          }))

        todas.push(...preguntas)

      } catch (error) {

        // No existe el fichero: lo ignoramos.
        console.warn(
          `Fuente no disponible: ${path}`
        )

      }
    }

    this.temas[cacheKey] = todas

    await this.storage.set(
      cacheKey,
      todas
    )

    return todas
  }

  /*
   * CARGAR IVAP GENERAL / ADMINISTRATIVO
   *
   * Estos siguen funcionando como antes.
   */
  async getExamen(examen: string): Promise<Question[]> {

    const storageKey = `questions_v2_${examen}`

    const stored = await this.storage.get(storageKey)

    if (stored && Array.isArray(stored)) {
      return stored
    }

    const data =
      await firstValueFrom(
        this.http.get<Question[]>(
          `assets/data/${examen}.json`
        )
      )

    const preguntas = data.map(q => ({
      ...q,
      type: examen,
      source: examen
    }))

    await this.storage.set(
      storageKey,
      preguntas
    )

    return preguntas
  }

  /*
   * CONJUNTO
   *
   * Carga todos los temas y, dentro de cada tema,
   * las 3 fuentes.
   */
  async getCombined(): Promise<Question[]> {

    const todas: Question[] = []

    for (const tema of this.listaTemas) {

      const preguntas =
        await this.getTema(tema)

      todas.push(...preguntas)
    }

    return todas
  }

  reset() {
    this.temas = {}
  }

}
