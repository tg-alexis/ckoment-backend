import { Global, MiddlewareConsumer, Module, OnModuleInit, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { IdentificationGuard } from './commons/guards/identification.guard';
import { BootstrapService } from './commons/services/bootstrap.service';
import { PrismaService } from './commons/services/prisma.service';
import { PaginationMiddleware } from './commons/middlewares/pagination.middleware';
import { AuthModule } from './resources/auth/auth.module';
import { SecurityService } from './commons/services/security.service';
import { ViewmodelServiceProvider } from './commons/providers/viewmodelservice.provider';
import { ViewmodelService } from './commons/services/viewmodel.service';
import { ProductModule } from './resources/product/product.module';
import { CategoryModule } from './resources/category/category.module';
import { PrismaServiceProvider } from './commons/providers/prismaservice.provider';
import { PaginationService } from './commons/services/pagination.service';
import { PaginationServiceProvider } from './commons/providers/paginationservice.provider';
import { RedisService } from './commons/services/redis.service';
import { RedisServiceProvider } from './commons/providers/redisservice.provider';

@Global() // Marque le module comme global
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Assurez-vous que le ConfigModule est global
    }),

    // Modules de ressources
    AuthModule,
    ProductModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: IdentificationGuard,
    },
    PrismaService,
    PrismaServiceProvider,
    ViewmodelService,
    ViewmodelServiceProvider,
    PaginationService,
    PaginationServiceProvider,
    SecurityService,
    BootstrapService,
    RedisService,
    RedisServiceProvider
  ],
  exports: [PrismaService, PrismaServiceProvider, ViewmodelServiceProvider, ViewmodelService, PaginationServiceProvider, PaginationService, RedisService, RedisServiceProvider, SecurityService], // Exporte les services globaux
})
export class AppModule implements OnModuleInit {

  constructor(
    private readonly viewmodelService: ViewmodelService,
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly redisService: RedisService,
  ) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }

  onModuleInit() {
    ViewmodelServiceProvider.setViewmodelService(this.viewmodelService);
    PrismaServiceProvider.setPrismaService(this.prismaService);
    PaginationServiceProvider.setPaginationService(this.paginationService);
    RedisServiceProvider.setRedisService(this.redisService);
  }
}
