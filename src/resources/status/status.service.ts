import { Inject, Injectable } from '@nestjs/common';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusEntity } from './entities/status.entity';

@Injectable()
export class StatusService extends BaseCRUDService<StatusEntity> {
  constructor(@Inject('MODEL_MAPPING') modelName: string) {
    super(modelName);
  }

  async create(createStatusDto: CreateStatusDto, connectedUserId?: string) {
    return this.genericCreate({
      data: createStatusDto,
      connectedUserId,
    });
  }

  async findAll(params?: IPaginationParams) {
    return this.genericFindAll({
      params,
      orderBy: [{ name: 'asc' }],
    });
  }

  async findOne(id: string) {
    return this.genericFindOne({ id });
  }

  async findOneBy(
    whereClause: any,
    include?: any,
    select?: any,
  ): Promise<StatusEntity> {
    return this.genericFindOneBy({ whereClause, include, select });
  }

  async update(
    id: string,
    updateStatusDto: UpdateStatusDto,
    connectedUserId?: string,
  ) {
    return this.genericUpdate({
      id,
      data: updateStatusDto,
      connectedUserId,
    });
  }

  async delete(id: string) {
    return this.genericDelete(id);
  }

  async softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete({ id, connectedUserId });
  }

  async restore(id: string, connectedUserId?: string) {
    return this.genericRestore({ id, connectedUserId });
  }

  async count(whereClause?: any): Promise<number> {
    return this.genericCount(whereClause);
  }

  async getByName(name: string): Promise<StatusEntity> {
    return this.genericFindOneBy({
      whereClause: { name },
    });
  }
}
