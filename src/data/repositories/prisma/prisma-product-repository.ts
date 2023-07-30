/* eslint-disable @typescript-eslint/return-await */
import { type Product } from '@prisma/client'
import { type ListOperationDtos, type CreateOperationDtos, type ProductRepository } from '../protocols/product-repository'
import { prisma } from '~/infra/db'

export class PrismaProductRepository implements ProductRepository {
  async list (options: ListOperationDtos): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      },
      skip: options.skip,
      take: options.get
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
