export class EditProduct {
  async execute (price?: number, name?: string, stock: number, userId: string) {
    return {
      price,
      name,
      stock
    }
  }
}
