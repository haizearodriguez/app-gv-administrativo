import { Injectable } from '@angular/core'
import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private storage: StorageService) {}

  private getKey(
    id: number,
    type: string,
    source: string
  ): string {
    return `${type}_${source}_${id}`
  }

  async recordAnswer(
    id: number,
    type: string,
    source: string,
    correct: boolean
  ) {

    let stats =
      await this.storage.get('stats') || {}

    const key =
      this.getKey(id, type, source)

    if (!stats[key]) {

      stats[key] = {
        id,
        type,
        source,
        attempts: 0,
        correct: 0,
        wrong: 0,
        lastAttempt: null,
        historialFallos: [],
        historialAciertos: []
      }
    }

    stats[key].attempts++

    const now =
      new Date().toISOString()

    stats[key].lastAttempt = now

    if (correct) {

      stats[key].correct++

      stats[key].historialAciertos = [
        ...(stats[key].historialAciertos || []),
        now
      ]

    } else {

      stats[key].wrong++

      stats[key].historialFallos = [
        ...(stats[key].historialFallos || []),
        now
      ]
    }

    await this.storage.set(
      'stats',
      stats
    )
  }

  async getResumenHoy() {

    const stats =
      await this.storage.get('stats') || {}

    const hoy =
      new Date().toDateString()

    let correctas = 0
    let incorrectas = 0

    Object.values(stats).forEach((s: any) => {

      correctas +=
        (s.historialAciertos || [])
          .filter(
            (f: string) =>
              new Date(f).toDateString() === hoy
          ).length

      incorrectas +=
        (s.historialFallos || [])
          .filter(
            (f: string) =>
              new Date(f).toDateString() === hoy
          ).length
    })

    const total =
      correctas + incorrectas

    return {
      total,
      correctas,
      incorrectas,
      pctAciertos:
        total
          ? Math.round((correctas / total) * 100)
          : 0,
      pctFallos:
        total
          ? Math.round((incorrectas / total) * 100)
          : 0
    }
  }

  async getFallosHoy(): Promise<any[]> {

    const stats =
      await this.storage.get('stats') || {}

    const hoy =
      new Date().toDateString()

    return Object.values(stats)
      .filter((s: any) =>
        (s.historialFallos || [])
          .some(
            (f: string) =>
              new Date(f).toDateString() === hoy
          )
      )
      .sort(
        (a: any, b: any) =>
          b.wrong - a.wrong
      )
  }

  async getStats(): Promise<Record<string, any>> {

    return await this.storage.get('stats') || {}
  }

  getRatio(stat: any) {

    if (!stat) return 0

    const total =
      stat.correct + stat.wrong

    if (total === 0) return 0

    const ratio =
      stat.correct / total

    if (ratio > 0.9) return 1.5
    if (ratio > 0.75) return 1.2
    if (ratio > 0.5) return 1

    return 0
  }

  async getResumenDia(fecha: Date) {

    const stats =
      await this.storage.get('stats') || {}

    const dia =
      fecha.toDateString()

    let correctas = 0
    let incorrectas = 0

    Object.values(stats).forEach((s: any) => {

      correctas +=
        (s.historialAciertos || [])
          .filter(
            (f: string) =>
              new Date(f).toDateString() === dia
          ).length

      incorrectas +=
        (s.historialFallos || [])
          .filter(
            (f: string) =>
              new Date(f).toDateString() === dia
          ).length
    })

    const total =
      correctas + incorrectas

    return {
      total,
      correctas,
      incorrectas,
      pctAciertos:
        total
          ? Math.round((correctas / total) * 100)
          : 0,
      pctFallos:
        total
          ? Math.round((incorrectas / total) * 100)
          : 0
    }
  }

  async getFallosDia(fecha: Date): Promise<any[]> {

    const stats =
      await this.storage.get('stats') || {}

    const dia =
      fecha.toDateString()

    return Object.values(stats)
      .filter((s: any) =>
        (s.historialFallos || [])
          .some(
            (f: string) =>
              new Date(f).toDateString() === dia
          )
      )
      .sort(
        (a: any, b: any) =>
          b.wrong - a.wrong
      )
  }

  async getDiasConActividad(): Promise<Set<string>> {

    const stats =
      await this.storage.get('stats') || {}

    const dias =
      new Set<string>()

    Object.values(stats).forEach((s: any) => {

      ;[
        ...(s.historialAciertos || []),
        ...(s.historialFallos || [])
      ].forEach((f: string) => {

        dias.add(
          new Date(f).toDateString()
        )
      })
    })

    return dias
  }

  async getRespondidasDia(
    fecha: Date
  ): Promise<Set<string>> {

    const stats =
      await this.storage.get('stats') || {}

    const dia =
      fecha.toDateString()

    const respondidas =
      new Set<string>()

    Object.values(stats).forEach((s: any) => {

      const acierto =
        (s.historialAciertos || [])
          .some(
            (f: string) =>
              new Date(f).toDateString() === dia
          )

      const fallo =
        (s.historialFallos || [])
          .some(
            (f: string) =>
              new Date(f).toDateString() === dia
          )

      if (acierto || fallo) {

        respondidas.add(
          this.getKey(
            s.id,
            s.type,
            s.source
          )
        )
      }
    })

    return respondidas
  }

}