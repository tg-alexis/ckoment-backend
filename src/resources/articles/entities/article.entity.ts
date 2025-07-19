import { ApiResponseProperty } from '@nestjs/swagger';
import { BasicEntity } from 'src/commons/shared/entities/basic.entity';

export class ArticleEntity extends BasicEntity {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  art_title: string;

  @ApiResponseProperty()
  art_sub_title?: string;

  @ApiResponseProperty()
  art_description?: string;

  @ApiResponseProperty()
  slug: string;

  @ApiResponseProperty()
  art_keywords?: string;

  @ApiResponseProperty()
  category_id: string;

  @ApiResponseProperty()
  status_id?: string;

  // Relations
  @ApiResponseProperty()
  category?: any;

  @ApiResponseProperty()
  status?: any;

  @ApiResponseProperty()
  users?: any[];

  constructor(data: any) {
    super();
    this.id = data.id;
    this.art_title = data.art_title;
    this.art_sub_title = data.art_sub_title;
    this.art_description = data.art_description;
    this.slug = data.slug;
    this.art_keywords = data.art_keywords;
    this.category_id = data.category_id;
    this.status_id = data.status_id;
    this.category = data.category;
    this.status = data.status;
    this.users = data.users;
  }
}
