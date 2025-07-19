import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Profile } from 'src/commons/enums/profile.enum';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserMapper } from './mappers/update-user.mapper';

@Injectable()
export class UserService extends BaseCRUDService<UserEntity> {
  constructor(@Inject('MODEL_MAPPING') modelName: string) {
    super(modelName);
  }

  async create(
    data: any,
    connectedUserId?: string,
    include?: any,
    select?: any,
  ): Promise<UserEntity> {
    return this.genericCreate({
      data,
      connectedUserId,
      include,
      select,
    });
  }

  async findAll(
    params?: IPaginationParams,
    whereClause?: any,
    include?: any,
    select?: any,
    orderBy?: any[],
  ): Promise<PaginationVm> {
    return this.genericFindAll({
      params,
      whereClause,
      include,
      select,
      orderBy: orderBy || [{ created_at: 'desc' }],
    });
  }

  async findOne(id: string, include?: any, select?: any): Promise<UserEntity> {
    return this.genericFindOne({
      id,
      include: include || {
        profile: true,
      },
      select,
    });
  }

  async findOneBy(
    whereClause: any,
    include?: any,
    select?: any,
  ): Promise<UserEntity> {
    return this.genericFindOneBy({
      whereClause,
      include: include || {
        profile: true,
      },
      select,
    });
  }

  async update(
    id: string,
    data: Partial<any>,
    connectedUserId?: string,
    include?: any,
    select?: any,
  ): Promise<UserEntity> {
    return this.genericUpdate({
      id,
      data,
      connectedUserId,
      include: include || {
        profile: true,
      },
      select,
    });
  }

  async delete(id: string): Promise<UserEntity> {
    return this.genericDelete(id);
  }

  async softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete({ id, connectedUserId });
  }

  async restore(id: string, connectedUserId?: string) {
    return this.genericRestore({ id, connectedUserId });
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
    connectedUserId?: string,
  ) {
    let updateData: any = { ...updateUserDto };

    // Si un nouveau mot de passe est fourni, vérifier l'ancien et hacher le nouveau
    if (updateUserDto.current_password && updateUserDto.new_password) {
      const user = await this.genericFindOne({
        id,
        select: {
          id: true,
          password: true,
        },
      });

      const isPasswordValid = await bcrypt.compare(
        updateUserDto.current_password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException(
          'Mot de passe actuel incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }

      updateData.password = await bcrypt.hash(updateUserDto.new_password, 12);
    }

    // Retirer les champs de mot de passe du DTO
    delete updateData.current_password;
    delete updateData.new_password;

    // Utiliser le mapper si disponible
    if (Object.keys(updateData).length > 0) {
      const oUser = new UpdateUserMapper(updateData);
      updateData = oUser;
    }

    return this.genericUpdate({
      id,
      data: updateData,
      connectedUserId,
      include: {
        profile: true,
      },
    });
  }

  async getProfile(id: string) {
    return this.genericFindOne({
      id,
      include: {
        profile: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.genericFindOneBy({
      whereClause: { email },
      include: {
        profile: true,
      },
    });
  }

  async findActiveUsers(params?: IPaginationParams) {
    return this.genericFindAll({
      params,
      whereClause: {
        is_active: true,
        deleted_at: null,
      },
      include: {
        profile: true,
      },
      orderBy: [{ created_at: 'desc' }],
    });
  }

  async findUsersByProfile(profile: Profile, params?: IPaginationParams) {
    return this.genericFindAll({
      params,
      whereClause: {
        profile: {
          libelle: profile,
        },
      },
      include: {
        profile: true,
      },
      orderBy: [{ created_at: 'desc' }],
    });
  }

  async activateUser(id: string, connectedUserId?: string) {
    return this.genericUpdate({
      id,
      data: {
        is_active: true,
        mail_verified_at: new Date(),
      },
      connectedUserId,
      include: {
        profile: true,
      },
    });
  }

  async deactivateUser(id: string, connectedUserId?: string) {
    return this.genericUpdate({
      id,
      data: {
        is_active: false,
      },
      connectedUserId,
      include: {
        profile: true,
      },
    });
  }

  async count(whereClause?: any): Promise<number> {
    return this.genericCount(whereClause);
  }
}
