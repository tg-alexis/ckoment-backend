import { Inject, Injectable } from '@nestjs/common';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { SlugService } from 'src/commons/services/slug.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService extends BaseCRUDService<ArticleEntity> {
  constructor(
    protected readonly slugService: SlugService,
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(modelName);
  }

  async create(createArticleDto: CreateArticleDto, connectedUserId?: string) {
    const slug = this.slugService.slugify(createArticleDto.art_title);

    const articleData = {
      ...createArticleDto,
      slug,
    };

    const article = await this.genericCreate({
      data: articleData,
      connectedUserId,
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
              },
            },
          },
        },
      },
    });

    // Si un utilisateur est connecté, associer l'article à cet utilisateur
    if (connectedUserId) {
      await this.associateUserToArticle(article.id, connectedUserId);
    }

    return article;
  }

  async findAll(params?: IPaginationParams) {
    return this.genericFindAll({
      params,
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
              },
            },
          },
        },
      },
      orderBy: [{ created_at: 'desc' }],
    });
  }

  async findOne(id: string) {
    return this.genericFindOne({
      id,
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.genericFindOneBy({
      whereClause: { slug },
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  async findByCategory(categoryId: string, params?: IPaginationParams) {
    return this.genericFindAll({
      params,
      whereClause: { category_id: categoryId },
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
              },
            },
          },
        },
      },
      orderBy: [{ created_at: 'desc' }],
    });
  }

  async findByUser(userId: string, params?: IPaginationParams) {
    return this.genericFindAll({
      params,
      whereClause: {
        users: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
              },
            },
          },
        },
      },
      orderBy: [{ created_at: 'desc' }],
    });
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    connectedUserId?: string,
  ) {
    const updateData: any = { ...updateArticleDto };

    // Regénérer le slug si le titre change
    if (updateArticleDto.art_title) {
      updateData.slug = this.slugService.slugify(updateArticleDto.art_title);
    }

    return this.genericUpdate({
      id,
      data: updateData,
      connectedUserId,
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.genericDelete(id);
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

  async publish(id: string, statusId: string, connectedUserId?: string) {
    return this.genericUpdate({
      id,
      data: { status_id: statusId },
      connectedUserId,
      include: {
        category: true,
        status: true,
      },
    });
  }

  async associateUserToArticle(articleId: string, userId: string) {
    // Utiliser Prisma directement pour cette relation many-to-many
    const prisma = this.getClient();
    return prisma.userArticles.create({
      data: {
        article_id: articleId,
        user_id: userId,
      },
    });
  }

  async removeUserFromArticle(articleId: string, userId: string) {
    const prisma = this.getClient();
    return prisma.userArticles.delete({
      where: {
        user_id_article_id: {
          user_id: userId,
          article_id: articleId,
        },
      },
    });
  }

  async search(query: string, params?: IPaginationParams) {
    return this.genericFindAll({
      params,
      whereClause: {
        OR: [
          {
            art_title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            art_description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            art_keywords: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
        status: true,
        users: {
          include: {
            users: {
              select: {
                id: true,
                noms: true,
                prenoms: true,
                email: true,
                photo_path: true,
              },
            },
          },
        },
      },
      orderBy: [{ created_at: 'desc' }],
    });
  }

  async count(whereClause?: any): Promise<number> {
    return this.genericCount(whereClause);
  }

  // Méthode pour obtenir le client Prisma
  private getClient() {
    return (this as any).prismaService;
  }
}
