import { type Product } from '@prisma/client'
import { type ListOperationDtos, type CreateOperationDtos, type ProductRepository, type PartialProduct } from '../protocols/product-repository'
import { prisma } from '~/infra/db'

export class PrismaProductRepository implements ProductRepository {
  async count (): Promise<number> {
    return prisma.product.count()
  }

  async findById (id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: {
        id
      }
    })
  }

  async save (product: Product): Promise<Product | null> {
    const { id, ...update } = product

    return await prisma.product.update({
      where: {
        id
      },
      data: {
        ...update
      }
    })
  }

  async list (options: ListOperationDtos): Promise<PartialProduct[]> {
    return prisma.product.findMany({
      where: {
        deletedAt: null,
        name: {
          mode: 'insensitive',
          endsWith: options.search.name?.type === 'endsWith' ? options.search.name.value : undefined,
          startsWith: options.search.name?.type === 'startsWith' ? options.search.name.value : undefined,
          contains: options.search.name?.type === 'fuzzy' ? options.search.name.value : undefined
        }
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
    return prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        userId: data.userId,
        updatedAt: null
      }
    })
  }
}
