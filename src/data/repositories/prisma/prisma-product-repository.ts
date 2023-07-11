/* eslint-disable @typescript-eslint/return-await */
import { type Product } from '@prisma/client'
import { type CreateOperationDtos, type ProductRepository } from '../protocols/product-repository'
import { prisma } from '~/infra/db'

export class PrismaProductRepository implements ProductRepository {
  async list (): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    })
  }

  async create (data: CreateOperationDtos): Promise<Product> {
    return await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        userId: data.userId
      }
    })
  }
}
