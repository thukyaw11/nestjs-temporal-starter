/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
/* eslint-disable import/order */
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import configs from '@config/index';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { TemporalModule } from 'nestjs-temporal';
import { CartActivity } from '@app/modules/cart/cart.activity';


@Module({
  controllers: [],
  providers: [
    CartActivity
  ],
  imports: [
    TemporalModule.registerWorker({
      workerOptions: {
        taskQueue: 'staging',
        workflowsPath: require.resolve('../../modules/cart/cart.workflow'),
      },
    }),
    TemporalModule.registerClient(),
    PrismaModule,
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: [`.env`],
      expandVariables: true,
      validationSchema: Joi.object({
        // app config
        PORT: Joi.number().default('3000').required(),
        API_PREFIX: Joi.string().required(),
        ENABLE_VERSION: Joi.boolean().required(),
        VERSION_PREFIX: Joi.string().required(),
        DEFAULT_VERSION: Joi.string().required(),
        TZ: Joi.string().required(),
        // auth config
        AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().default('15m').required(),
        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().alphanum().min(5).max(50).required(),
        AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().default('182d').required(),
        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().alphanum().min(5).max(50).required(),
        AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean().default(false).required(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string().allow(null, '').min(5).max(50).optional(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string().allow(null, '').min(5).max(50).optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string().allow(null, '').min(5).max(50).optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string().allow(null, '').min(5).max(50).optional(),

        // swagger config
        SW_USERNAME: Joi.string().default('nest').required(),
        SW_PASSWORD: Joi.string().default('password').required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class CommonModule {}
