import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { Activities, Activity } from 'nestjs-temporal';


export interface ICartActivity {
  addItemToCart: (userId: string, productId: string, quantity: number) => Promise<any>;
  getCartItems: (userId: string) => Promise<any>;
  updateCartItem: (userId: string, productId: string, quantity: number) => Promise<any>;
  removeCartItem: (userId: string, productId: string) => Promise<any>;
  validateProduct: (productId: string, quantity: number) => Promise<boolean>;
}

@Injectable()
@Activities()
export class CartActivity implements ICartActivity {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  @Activity()
  async addItemToCart(userId: string, productId: string, quantity: number): Promise<any> {
      return "Add item to cart activity run .."
  }

  @Activity()
  async getCartItems(userId: string): Promise<any> {
    return "Get cart times activity run.."
  }

  @Activity()
  async updateCartItem(userId: string, productId: string, quantity: number): Promise<any> {
    return "Update cart item activity run.."
  }


  @Activity()
  async removeCartItem(userId: string, productId: string): Promise<any> {
    return "Remove cart item activity run.."
  }

  
  @Activity()
  async validateProduct(productId: string, quantity: number): Promise<boolean> {
    return true;
  }
}