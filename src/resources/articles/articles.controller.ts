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
  Query,
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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN, Profile.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel article' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Article créé avec succès',
    type: ArticleEntity,
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
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: CustomRequest,
  ) {
    return this.articlesService.create(createArticleDto, req.user?.id);
  }

  @Get()
  @Pagination()
  @ApiOperation({ summary: 'Obtenir tous les articles' })
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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Recherche dans les articles',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des articles récupérée avec succès',
  })
  async findAll(@Req() req: CustomRequest, @Query('search') search?: string) {
    if (search) {
      return this.articlesService.search(search, req.pagination);
    }
    return this.articlesService.findAll(req.pagination);
  }

  @Get('category/:categoryId')
  @Pagination()
  @ApiOperation({ summary: "Obtenir les articles d'une catégorie" })
  @ApiParam({
    name: 'categoryId',
    description: 'ID de la catégorie',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Articles de la catégorie récupérés avec succès',
  })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Req() req: CustomRequest,
  ) {
    return this.articlesService.findByCategory(categoryId, req.pagination);
  }

  @Get('user/:userId')
  @Pagination()
  @ApiOperation({ summary: "Obtenir les articles d'un utilisateur" })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Articles de l'utilisateur récupérés avec succès",
  })
  async findByUser(@Param('userId') userId: string, @Req() req: CustomRequest) {
    return this.articlesService.findByUser(userId, req.pagination);
  }

  @Get('my-articles')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN, Profile.CLIENT)
  @Pagination()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir mes articles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mes articles récupérés avec succès',
  })
  async findMyArticles(@Req() req: CustomRequest) {
    return this.articlesService.findByUser(req.user.id, req.pagination);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtenir un article par son slug' })
  @ApiParam({
    name: 'slug',
    description: "Slug de l'article",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article trouvé',
    type: ArticleEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article non trouvé',
  })
  async findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un article par son ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article trouvé',
    type: ArticleEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article non trouvé',
  })
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN, Profile.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un article' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article mis à jour avec succès',
    type: ArticleEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non autorisé',
  })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: CustomRequest,
  ) {
    return this.articlesService.update(id, updateArticleDto, req.user?.id);
  }

  @Put(':id/publish')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publier un article' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article publié avec succès',
  })
  async publish(
    @Param('id') id: string,
    @Body('statusId') statusId: string,
    @Req() req: CustomRequest,
  ) {
    return this.articlesService.publish(id, statusId, req.user?.id);
  }

  @Put(':id/associate-user/:userId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Associer un utilisateur à un article' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Utilisateur associé avec succès',
  })
  async associateUser(
    @Param('id') articleId: string,
    @Param('userId') userId: string,
  ) {
    return this.articlesService.associateUserToArticle(articleId, userId);
  }

  @Delete(':id/remove-user/:userId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Retirer un utilisateur d'un article" })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Utilisateur retiré avec succès',
  })
  async removeUser(
    @Param('id') articleId: string,
    @Param('userId') userId: string,
  ) {
    return this.articlesService.removeUserFromArticle(articleId, userId);
  }

  @Delete(':id/soft')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un article (suppression douce)' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Article supprimé avec succès',
  })
  async softDelete(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.articlesService.softDelete(id, req.user?.id);
  }

  @Put(':id/restore')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restaurer un article supprimé' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article restauré avec succès',
  })
  async restore(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.articlesService.restore(id, req.user?.id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SetProfile(Profile.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer définitivement un article' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Article supprimé définitivement',
  })
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
