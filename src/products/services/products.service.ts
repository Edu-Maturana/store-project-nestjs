import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import { BrandsService } from './brands.service';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    private brandsService: BrandsService,
  ) {}

  findAll() {
    return this.productsRepo.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = this.productsRepo.create(data);
    if (data.brandId) {
      const brand = await this.brandsService.findOne(data.brandId);
      newProduct.brand = brand;
    }
    return this.productsRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productsRepo.findOne(id);
    if (changes.brandId) {
      const brand = await this.brandsService.findOne(changes.brandId);
      product.brand = brand;
    }
    this.productsRepo.merge(product, changes);
    return this.productsRepo.save(product);
  }

  remove(id: number) {
    return this.productsRepo.delete(id);
  }
}
