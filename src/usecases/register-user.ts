interface Response {
  message: string
}

export class RegisterUser {
  execute (): Response {
    return {
      message: 'Register user usecase'
    }
  }
}
