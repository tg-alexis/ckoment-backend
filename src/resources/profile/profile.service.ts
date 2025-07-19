import { Inject, Injectable } from '@nestjs/common';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfileService extends BaseCRUDService<ProfileEntity> {
  constructor(@Inject('MODEL_MAPPING') modelName: string) {
    super(modelName);
  }

  async create(createProfileDto: CreateProfileDto, connectedUserId?: string) {
    return this.genericCreate({
      data: {
        ...createProfileDto,
      },
      connectedUserId,
    });
  }

  findAll(params?: IPaginationParams | undefined) {
    return this.genericFindAll({ params });
  }

  findOne(id: string) {
    return this.genericFindOne({ id });
  }

  findOneBy(
    whereClause: any,
    include?: any,
    select?: any,
  ): Promise<ProfileEntity> {
    return this.genericFindOneBy({ whereClause, include, select });
  }

  update(
    id: string,
    updateCategoryDto: UpdateProfileDto,
    connectedUserId?: string,
  ) {
    return this.genericUpdate({
      id,
      data: {
        ...updateCategoryDto,
      },
      connectedUserId,
    });
  }

  delete(id: string) {
    return this.genericDelete(id);
  }

  softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete({ id, connectedUserId });
  }

  restore(id: string, connectedUserId?: string) {
    return this.genericRestore({ id, connectedUserId });
  }

  async count(whereClause?: any): Promise<number> {
    return this.genericCount(whereClause);
  }

  async groupBy(
    by: any,
    whereClause?: any,
    orderBy?: any,
    skip?: number,
    take?: number,
  ): Promise<any> {
    return this.genericGroupBy({ by, whereClause, orderBy, skip, take });
  }
}
