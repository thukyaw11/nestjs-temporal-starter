import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller({
  version: '1',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/items')
  async addToCart(
    @Param('userId') userId: string,
    @Body() body: { productId: string; quantity: number }
  ) {
    const { productId, quantity } = body;
    return await this.cartService.addToCart(userId, productId, quantity);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return await this.cartService.getCart(userId);
  }

  @Put(':userId/items/:productId')
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number }
  ) {
    const { quantity } = body;
    return await this.cartService.updateCartItem(userId, productId, quantity);
  }

  @Delete(':userId/items/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return await this.cartService.removeFromCart(userId, productId);
  }
}
