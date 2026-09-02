export interface Question {
  id: number
  type: string
  tema?: string
  source?: string
  question: string

  answers: {
    a: string
    b: string
    c: string
    d: string
  }

  correct: string
}