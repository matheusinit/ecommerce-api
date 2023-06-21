import { prisma } from '~/infra/db'

export class ListProducts {
  async execute () {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    })

    return products
  }
}
