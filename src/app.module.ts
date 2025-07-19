import {
  Global,
  MiddlewareConsumer,
  Module,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { IsDataExistsConstraint } from './commons/decorators/is-data-exists.decorator';
import { IsUniqueConstraint } from './commons/decorators/is-unique.decorator';
import { AppEntityConstraint } from './commons/decorators/match-entity.decorator';
import { IdentificationGuard } from './commons/guards/identification.guard';
import { RequestContextInterceptor } from './commons/interceptors/request-context.interceptor';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { PaginationMiddleware } from './commons/middlewares/pagination.middleware';
import { PaginationServiceProvider } from './commons/providers/pagination-service.provider';
import { PrismaServiceProvider } from './commons/providers/prisma-service.provider';
import { RedisServiceProvider } from './commons/providers/redis-service.provider';
import { RequestContextServiceProvider } from './commons/providers/request-context-service.provider';
import { ViewmodelServiceProvider } from './commons/providers/viewmodel-service.provider';
import { AppContextService } from './commons/services/app-context.service';
import { BootstrapService } from './commons/services/bootstrap.service';
import { PaginationService } from './commons/services/pagination.service';
import { PrismaService } from './commons/services/prisma.service';
import { RedisService } from './commons/services/redis.service';
import { RequestContextService } from './commons/services/request-context.service';
import { SecurityService } from './commons/services/security.service';
import { StorageService } from './commons/services/storage.service';
import { ViewmodelService } from './commons/services/viewmodel.service';
import { AdminModule } from './resources/admin/admin.module';
import { ArticlesModule } from './resources/articles/articles.module';
import { AuthModule } from './resources/auth/auth.module';
import { CategoryModule } from './resources/category/category.module';
import { StatusModule } from './resources/status/status.module';
import { UserModule } from './resources/user/user.module';

/**
 * Module principal de l'application.
 * Configuré comme global pour fournir des services et fonctionnalités communs à toute l'application.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Assure que le ConfigModule est global
      envFilePath: '.env', // Fichier .env à charger
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    // Modules de ressources
    AuthModule,
    CategoryModule,
    UserModule,
    AdminModule,
    ArticlesModule,
    StatusModule,
  ],
  providers: [
    // Interceptors globaux
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    // Guards globaux
    {
      provide: APP_GUARD,
      useClass: IdentificationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    BootstrapService,
    // Services principaux
    PrismaService,
    PrismaServiceProvider,
    ViewmodelService,
    ViewmodelServiceProvider,
    PaginationService,
    PaginationServiceProvider,
    RedisService,
    RedisServiceProvider,
    RequestContextService,
    RequestContextServiceProvider,
    SecurityService,
    StorageService,
    AppContextService,
    // Decorators personnalisés
    IsUniqueConstraint,
    IsDataExistsConstraint,
    AppEntityConstraint,
  ],
  exports: [
    // Exporte les services globaux pour être utilisés dans d'autres modules
    PrismaService,
    PrismaServiceProvider,
    ViewmodelService,
    ViewmodelServiceProvider,
    PaginationServiceProvider,
    PaginationService,
    RedisService,
    RedisServiceProvider,
    RequestContextService,
    RequestContextServiceProvider,
    SecurityService,
    StorageService,
    AppContextService,
    IsUniqueConstraint,
    IsDataExistsConstraint,
    AppEntityConstraint,
  ],
})
export class AppModule implements OnModuleInit {
  /**
   * Construit le module AppModule.
   * @param {ViewmodelService} viewmodelService - Service de gestion des view models.
   * @param {PrismaService} prismaService - Service d'accès aux données avec Prisma.
   * @param {PaginationService} paginationService - Service de pagination des données.
   * @param {RedisService} redisService - Service de gestion de la base de données Redis.
   * @param {RequestContextService} requestContextService - Service de contexte de requête.
   * @param {AppContextService} appContextService - Service de contexte application.
   */
  constructor(
    private readonly viewmodelService: ViewmodelService,
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly redisService: RedisService,
    private readonly requestContextService: RequestContextService,
    private readonly appContextService: AppContextService,
  ) {}

  /**
   * Configure le middleware de pagination pour toutes les routes HTTP GET de l'application.
   * @param {MiddlewareConsumer} consumer - Consommateur de middleware pour configurer les middleware.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }

  /**
   * Fonction du cycle de vie appelée lors de l'initialisation du module.
   * Définit les services globaux pour leur utilisation dans toute l'application.
   */
  onModuleInit(): void {
    ViewmodelServiceProvider.setService(this.viewmodelService);
    PaginationServiceProvider.setService(this.paginationService);
    RedisServiceProvider.setService(this.redisService);
    RequestContextServiceProvider.setService(this.requestContextService);
    PrismaServiceProvider.setService(this.prismaService);

    // Marquer la fin du bootstrap après un délai pour laisser tout s'initialiser
    setTimeout(() => {
      this.appContextService.setBootstrapComplete();
    }, 1000);
  }
}
