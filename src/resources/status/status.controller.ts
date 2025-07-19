import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { SetProfile } from 'src/commons/decorators/set-profile.decorator';
import { Profile } from 'src/commons/enums/profile.enum';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';
import { AuthorizationGuard } from 'src/commons/guards/authorization.guard';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusEntity } from './entities/status.entity';
import { StatusService } from './status.service';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau statut' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Statut créé avec succès',
    type: StatusEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non autorisé',
  })
  async create(
    @Body() createStatusDto: CreateStatusDto,
    @Req() req: CustomRequest,
  ) {
    return this.statusService.create(createStatusDto, req.user?.id);
  }

  @Get()
  @Pagination()
  @ApiOperation({ summary: 'Obtenir tous les statuts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des statuts récupérée avec succès',
  })
  async findAll(@Req() req: CustomRequest) {
    return this.statusService.findAll(req.pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un statut par son ID' })
  @ApiParam({
    name: 'id',
    description: 'ID du statut',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut trouvé',
    type: StatusEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Statut non trouvé',
  })
  async findOne(@Param('id') id: string) {
    return this.statusService.findOne(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Obtenir un statut par son nom' })
  @ApiParam({
    name: 'name',
    description: 'Nom du statut',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut trouvé',
    type: StatusEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Statut non trouvé',
  })
  async findByName(@Param('name') name: string) {
    return this.statusService.getByName(name);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un statut' })
  @ApiParam({
    name: 'id',
    description: 'ID du statut',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut mis à jour avec succès',
    type: StatusEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Statut non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non autorisé',
  })
  async update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req: CustomRequest,
  ) {
    return this.statusService.update(id, updateStatusDto, req.user?.id);
  }

  @Delete(':id/soft')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un statut (suppression douce)' })
  @ApiParam({
    name: 'id',
    description: 'ID du statut',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Statut supprimé avec succès',
  })
  async softDelete(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.statusService.softDelete(id, req.user?.id);
  }

  @Put(':id/restore')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restaurer un statut supprimé' })
  @ApiParam({
    name: 'id',
    description: 'ID du statut',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut restauré avec succès',
  })
  async restore(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.statusService.restore(id, req.user?.id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer définitivement un statut' })
  @ApiParam({
    name: 'id',
    description: 'ID du statut',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Statut supprimé définitivement',
  })
  async remove(@Param('id') id: string) {
    return this.statusService.delete(id);
  }
}
