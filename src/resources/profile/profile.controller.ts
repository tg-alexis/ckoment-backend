import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cacheable } from 'src/commons/decorators/cacheable.decorator';
import { InvalidateCache } from 'src/commons/decorators/invalidate-cache.decorator';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { ParamEntity } from 'src/commons/decorators/param-entity.decorator';
import { ParamId } from 'src/commons/decorators/param-id.decorator';
import { SetProfile } from 'src/commons/decorators/set-profile.decorator';
import { Transaction } from 'src/commons/decorators/transaction.decorator';
import { VerifyOwnership } from 'src/commons/decorators/verify-ownership.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { Profile } from 'src/commons/enums/profile.enum';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';
import { AuthorizationGuard } from 'src/commons/guards/authorization.guard';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';
import { ProfileVm } from 'src/commons/shared/viewmodels/profile.vm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Transaction()
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @InvalidateCache(['GET-/profiles-*'])
  @ApiResponse({ status: 201, type: ProfileVm })
  async create(
    @Body() createCategoryDto: CreateProfileDto,
    @Req() req: CustomRequest,
  ) {
    return ProfileVm.create(
      await this.profileService.create(
        {
          ...createCategoryDto,
        },
        req.user?.id,
      ),
    );
  }

  @Get()
  @Pagination()
  @Cacheable()
  @ApiResponse({ status: 200, type: PaginationVm })
  async findAll(@Req() req: CustomRequest) {
    return ProfileVm.createPaginated(
      await this.profileService.findAll(req.pagination),
    );
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProfileVm })
  @Cacheable()
  async findOne(
    @ParamEntity({
      model: ModelMappingTable.PROFILE,
      key: 'id',
      errorMessage: "Le profil n'existe pas !",
    })
    profile: ProfileEntity,
  ) {
    return ProfileVm.create(profile);
  }

  @Patch(':id')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @VerifyOwnership({
    table: ModelMappingTable.PROFILE,
    propertyPath: 'created_by',
    target: 'params',
  })
  @ApiResponse({ status: 200, type: ProfileVm })
  @InvalidateCache(['GET-/profiles-*'])
  async update(
    @ParamId({
      model: ModelMappingTable.PROFILE,
      errorMessage: "Le profil n'existe pas !",
    })
    id: string,
    @Body() updateCategoryDto: UpdateProfileDto,
    @Req() req: CustomRequest,
  ) {
    return ProfileVm.create(
      await this.profileService.update(id, updateCategoryDto, req.user?.id),
    );
  }

  @Delete(':id')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({
    status: 204,
    description: 'Le profil a été définitivement supprimée !',
  })
  @InvalidateCache(['GET-/profiles-*'])
  async remove(
    @ParamId({
      model: ModelMappingTable.PROFILE,
      errorMessage: "Le profile n'existe pas !",
    })
    id: string,
  ) {
    await this.profileService.delete(id);

    // Return success message with status code 204
    throw new HttpException(
      'Le profil a été définitivement supprimée !',
      HttpStatus.NO_CONTENT,
    );
  }

  @Delete(':id/soft')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: ProfileVm })
  @InvalidateCache(['GET-/profiles-*'])
  async softDelete(
    @ParamId({
      model: ModelMappingTable.PROFILE,
      errorMessage: "Le profil n'existe pas !",
    })
    id: string,
    @Req() req: CustomRequest,
  ) {
    return ProfileVm.create(
      await this.profileService.softDelete(id, req.user?.id),
    );
  }

  @Patch(':id/restore')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: ProfileVm })
  @InvalidateCache(['GET-/profiles-*'])
  async restore(
    @ParamId({
      model: ModelMappingTable.PROFILE,
      errorMessage: "Le profil n'existe pas !",
    })
    id: string,
    @Req() req: CustomRequest,
  ) {
    return ProfileVm.create(
      await this.profileService.restore(id, req.user?.id),
    );
  }
}
