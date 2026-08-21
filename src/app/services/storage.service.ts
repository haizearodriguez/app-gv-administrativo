import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  store: any = {}

  constructor() {}

  async init() {

    const saved = localStorage.getItem('app-storage')

    if (saved) {
      try {
        this.store = JSON.parse(saved)
      } catch {
        this.store = {}
      }
    }
  }

  save() {
    localStorage.setItem(
      'app-storage',
      JSON.stringify(this.store)
    )
  }

  async get(key: string) {
    return this.store[key]
  }

  async set(key: string, value: any) {
    this.store[key] = value
    this.save()
  }

  async remove(key: string) {
    delete this.store[key]
    this.save()
  }

}

export function initStorage(storage: StorageService) {
  return () => storage.init()
}