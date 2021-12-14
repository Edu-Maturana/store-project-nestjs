import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productsRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    const newProduct = this.productsRepo.create(data);
    return this.productsRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productsRepo.findOne(id);
    this.productsRepo.merge(product, changes);
    return this.productsRepo.save(product);
  }

  remove(id: number) {
    return this.productsRepo.delete(id);
  }
}
