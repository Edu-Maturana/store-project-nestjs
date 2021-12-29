import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import { BrandsService } from './brands.service';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from './../dtos/products.dtos';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  findAll(params?: FilterProductsDto) {
    if (params) {
      const { limit, offset } = params;
      return this.productsRepo.find({
        relations: ['brand'],
        take: limit,
        skip: offset,
      });
    }
    return this.productsRepo.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne(id, {
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = this.productsRepo.create(data);
    if (data.brandId) {
      const brand = await this.brandRepo.findOne(data.brandId);
      newProduct.brand = brand;
    }

    if (data.categoriesId) {
      const categories = await this.categoryRepo.findByIds(data.categoriesId);
      newProduct.categories = categories;
    }

    return this.productsRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productsRepo.findOne(id);
    if (changes.brandId) {
      const brand = await this.brandRepo.findOne(changes.brandId);
      product.brand = brand;
    }

    if (changes.categoriesId) {
      const categories = await this.categoryRepo.findByIds(
        changes.categoriesId,
      );
      product.categories = categories;
    }

    this.productsRepo.merge(product, changes);
    return this.productsRepo.save(product);
  }

  async removeCategory(productId: number, categoryId: number) {
    const product = await this.findOne(productId);
    product.categories = product.categories.filter((c) => c.id !== categoryId);
    return this.productsRepo.save(product);
  }

  async addCategory(productId: number, categoryId: number) {
    const product = await this.findOne(productId);
    const category = await this.categoryRepo.findOne(categoryId);
    product.categories.push(category);
    return this.productsRepo.save(product);
  }

  remove(id: number) {
    return this.productsRepo.delete(id);
  }
}
