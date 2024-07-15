import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IPaginationParams } from '../interfaces/pagination-params';
import { PaginationService } from './pagination.service';
import { PaginationVm } from '../shared/viewmodels/pagination.vm';
import { PrismaServiceProvider } from '../providers/prisma-service.provider';
import { PaginationServiceProvider } from '../providers/pagination-service.provider';
import { RequestContextService } from './request-context.service';
import { RequestContextServiceProvider } from '../providers/request-context-service.provider';
import { CustomRequest } from '../interfaces/custom_request';

/**
 * Base CRUD Service class for performing CRUD operations on a model.
 * @template T - The type of the model.
 */
@Injectable()
export class BaseCRUDService<T> {
  protected readonly modelName: string;
  protected model: any;
  protected pagination: PaginationService;

  protected static prisma: PrismaService;
  protected static paginationService: PaginationService;
  protected static requestContextService: RequestContextService;

  constructor(protected readonly modelNameParam: string) {
    this.modelName = modelNameParam;
  }

  private initModel() {
    return BaseCRUDService.getPrismaService()[this.modelName];
  }

  private initServices() {
    this.pagination = BaseCRUDService.getPaginationService();
    this.model = this.initModel();
  }

  private static getPrismaService(): PrismaService {
    if (!BaseCRUDService.prisma) {
      BaseCRUDService.prisma = PrismaServiceProvider.getService();
    }
    return BaseCRUDService.prisma;
  }

  private static getRequestContextService(): RequestContextService {
    if (!BaseCRUDService.requestContextService) {
      BaseCRUDService.requestContextService = RequestContextServiceProvider.getService();
    }
    return BaseCRUDService.requestContextService;
  }

  private static getPaginationService(): PaginationService {
    if (!BaseCRUDService.paginationService) {
      BaseCRUDService.paginationService = PaginationServiceProvider.getService();
    }
    return BaseCRUDService.paginationService;
  }

  private handleError(error: any, message: string) {
    Logger.error(error);
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  async genericCreate(
    data: any,
    connectedUserId?: string,
    include: any = {},
    select: any = {}
  ): Promise<T> {
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.create({
          data: {
            ...data,
            created_by: connectedUserId,
          },
          include,
          select: !include ? select : undefined,
        });
      } catch (error) {
        this.handleError(error, 'Error creating record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const createdData = await prisma.create(this.modelName, {
        ...data,
        created_by: connectedUserId,
      }, include, select);

      return createdData;
    } catch (error) {
      this.handleError(error, 'Error creating record');
    }
  }

  async genericFindAll(
    params?: IPaginationParams,
    whereClause: any = {},
    include: any = {},
    select: any = {},
    orderBy: any[] = []
  ): Promise<PaginationVm> {
    this.initServices();

    try {
      whereClause.deleted_at = null;
      return this.pagination.paginate(
        this.modelName,
        whereClause,
        include,
        orderBy,
        select,
        params,
        ['name', 'description']
      );
    } catch (error) {
      this.handleError(error, 'Error fetching records');
    }
  }

  async genericFindOne(
    id: string,
    include: any = {},
    select: any = {}
  ): Promise<T> {
    this.initServices();

    try {
      return await this.model.findUnique({
        where: { id },
        include,
        select: !include ? select : undefined,
      });
    } catch (error) {
      this.handleError(error, 'Error fetching record');
    }
  }

  async genericFindOneBy(
    whereClause: any,
    include: any = {},
    select: any = {}
  ): Promise<T> {
    this.initServices();

    try {
      return await this.model.findFirst({
        where: whereClause,
        include,
        select: !include ? select : undefined,
      });
    } catch (error) {
      this.handleError(error, 'Error fetching record');
    }
  }

  async genericUpdate(
    id: string,
    data: Partial<any>,
    connectedUserId?: string,
    include: any = {},
    select: any = {}
  ): Promise<T> {
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.update({
          where: { id },
          data: {
            ...data,
            updated_by: connectedUserId,
          },
          include,
          select: !include ? select : undefined
        });
      } catch (error) {
        this.handleError(error, 'Error updating record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const updatedData = await prisma.update(this.modelName, { id }, {
        ...data,
        updated_by: connectedUserId,
      }, include, select);

      return updatedData;
    } catch (error) {
      this.handleError(error, 'Error updating record');
    }
  }

  async genericDelete(
    id: string
  ): Promise<T> {
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.delete({ where: { id } });
      } catch (error) {
        this.handleError(error, 'Error deleting record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const deletedData = await prisma.delete(this.modelName, { id });

      return deletedData;
    } catch (error) {
      this.handleError(error, 'Error deleting record');
    }
  }

  async genericSoftDelete(
    id: string,
    connectedUserId?: string,
    include: any = {},
    select: any = {}
  ): Promise<T> {
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.update({
          where: { id },
          data: { deleted_at: new Date(), deleted_by: connectedUserId },
          include,
          select: !include ? select : undefined
        });
      } catch (error) {
        this.handleError(error, 'Error soft deleting record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const updatedData = await prisma.update(this.modelName, { id }, {
        deleted_at: new Date(),
        deleted_by: connectedUserId,
      }, include, select);

      return updatedData;
    } catch (error) {
      this.handleError(error, 'Error soft deleting record');
    }
  }

  async genericRestore(
    id: string,
    connectedUserId?: string,
    include: any = {},
    select: any = {}
  ): Promise<T> {
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.update({
          where: { id },
          data: { deleted_at: null, deleted_by: null, updated_by: connectedUserId },
          include,
          select: !include ? select : undefined
        });
      } catch (error) {
        this.handleError(error, 'Error restoring record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const updatedData = await prisma.update(this.modelName, { id }, {
        deleted_at: null,
        deleted_by: null,
        updated_by: connectedUserId,
      }, include, select);

      return updatedData;
    } catch (error) {
      this.handleError(error, 'Error restoring record');
    }
  }
}
