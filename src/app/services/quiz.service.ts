import { Injectable } from '@angular/core'
import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  used: any[] = []

  constructor(private storage: StorageService) {}

  private getKey(q: any): string {
    return `${q.type}_${q.source}_${q.id}`
  }

  async next(pool: any[], trackUsed = true) {

    if (!trackUsed) {
      return pool[
        Math.floor(Math.random() * pool.length)
      ]
    }

    const used =
      await this.storage.get('used') || []

    const unused =
      pool.filter(q => {

        const key = this.getKey(q)

        return !used.some(
          (u: any) => u.key === key
        )
      })

    if (unused.length === 0) {

      return pool[
        Math.floor(Math.random() * pool.length)
      ]
    }

    return unused[
      Math.floor(Math.random() * unused.length)
    ]
  }

  async markUsed(
    id: number,
    type: string,
    source: string
  ) {

    let used =
      await this.storage.get('used') || []

    const key =
      `${type}_${source}_${id}`

    if (!used.some(
      (u: any) => u.key === key
    )) {

      used.push({
        key,
        id,
        type,
        source
      })

      await this.storage.set(
        'used',
        used
      )
    }
  }

}