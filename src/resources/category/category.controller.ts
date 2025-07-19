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
import { CategoryVm } from 'src/commons/shared/viewmodels/category.vm';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Transaction()
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @InvalidateCache(['GET-/categories-*'])
  @ApiResponse({ status: 201, type: CategoryVm })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: CustomRequest,
  ) {
    return CategoryVm.create(
      await this.categoryService.create(
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
    return CategoryVm.createPaginated(
      await this.categoryService.findAll(req.pagination),
    );
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: CategoryVm })
  @Cacheable()
  async findOne(
    //@ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string,
    @ParamEntity({
      model: ModelMappingTable.CATEGORY,
      key: 'id',
      errorMessage: "La catégorie n'existe pas !",
    })
    category: CategoryEntity,
  ) {
    return CategoryVm.create(category);
  }

  @Patch(':id')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @VerifyOwnership({
    table: ModelMappingTable.CATEGORY,
    propertyPath: 'created_by',
    target: 'params',
  })
  @ApiResponse({ status: 200, type: CategoryVm })
  @InvalidateCache(['GET-/categories-*'])
  async update(
    @ParamId({
      model: ModelMappingTable.CATEGORY,
      errorMessage: "La catégorie n'existe pas !",
    })
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: CustomRequest,
  ) {
    return CategoryVm.create(
      await this.categoryService.update(id, updateCategoryDto, req.user?.id),
    );
  }

  @Delete(':id')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({
    status: 204,
    description: 'La catégorie a été définitivement supprimée !',
  })
  @InvalidateCache(['GET-/categories-*'])
  async remove(
    @ParamId({
      model: ModelMappingTable.CATEGORY,
      errorMessage: "La catégorie n'existe pas !",
    })
    id: string,
  ) {
    await this.categoryService.delete(id);

    // Return success message with status code 204
    throw new HttpException(
      'La catégorie a été définitivement supprimée !',
      HttpStatus.NO_CONTENT,
    );
  }

  @Delete(':id/soft')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: CategoryVm })
  @InvalidateCache(['GET-/categories-*'])
  async softDelete(
    @ParamId({
      model: ModelMappingTable.CATEGORY,
      errorMessage: "La catégorie n'existe pas !",
    })
    id: string,
    @Req() req: CustomRequest,
  ) {
    return CategoryVm.create(
      await this.categoryService.softDelete(id, req.user?.id),
    );
  }

  @Patch(':id/restore')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: CategoryVm })
  @InvalidateCache(['GET-/categories-*'])
  async restore(
    @ParamId({
      model: ModelMappingTable.CATEGORY,
      errorMessage: "La catégorie n'existe pas !",
    })
    id: string,
    @Req() req: CustomRequest,
  ) {
    return CategoryVm.create(
      await this.categoryService.restore(id, req.user?.id),
    );
  }
}
