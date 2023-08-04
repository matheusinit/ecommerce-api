import { type Product } from '@prisma/client'
import { type ListOperationDtos, type CreateOperationDtos, type ProductRepository, type PartialProduct } from '../protocols/product-repository'
import { prisma } from '~/infra/db'

export class PrismaProductRepository implements ProductRepository {
  async count (): Promise<number> {
    return await prisma.product.count()
  }

  async list (options: ListOperationDtos): Promise<PartialProduct[]> {
    return await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      },
      skip: options.skip,
      take: options.get,
      select: {
        id: options.select.id ?? true,
        name: options.select.name ?? true,
        price: options.select.price ?? true,
        userId: options.select.userId ?? true,
        createdAt: options.select.createdAt ?? true,
        updatedAt: options.select.updatedAt ?? true,
        deletedAt: options.select.deletedAt ?? true
      }
    })
  }

  async create (data: CreateOperationDtos): Promise<Product> {
    return await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        userId: data.userId,
        updatedAt: null
      }
    })
  }
}
