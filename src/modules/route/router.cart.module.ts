import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CartController } from '../cart/cart.controller';
import { CartService } from '../cart/cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [],
  imports: [],
})
export class RoutesCartModule {}
