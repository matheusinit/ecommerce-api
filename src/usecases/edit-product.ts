export class EditProduct {
  async execute (price?: number, name?: string, userId: string) {
    return {
      price,
      name
    }
  }
}
