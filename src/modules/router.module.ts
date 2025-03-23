import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesUserModule } from './route/router.user.module';
import { RoutesCartModule } from './route/router.cart.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(
      RoutesUserModule,
      RoutesCartModule,
      NestJsRouterModule.register([
        {
          path: '/user',
          module: RoutesUserModule,
        },
        {
          path: '/cart',
          module: RoutesCartModule,
        }
      ]),
    );
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
