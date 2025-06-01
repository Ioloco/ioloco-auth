export class MFAError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MFAError'
  }
}
