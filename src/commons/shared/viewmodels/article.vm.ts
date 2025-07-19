import { ApiResponseProperty } from '@nestjs/swagger';
import { BaseVm } from './base.vm';
import { CategoryVm } from './category.vm';
import { UserMinVm } from './user.min.vm';

export class ArticleVm extends BaseVm {
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

  @ApiResponseProperty()
  category?: CategoryVm;

  @ApiResponseProperty()
  users?: UserMinVm[];

  constructor(data: any) {
    super(data);
    this.id = data.id;
    this.art_title = data.art_title;
    this.art_sub_title = data.art_sub_title;
    this.art_description = data.art_description;
    this.slug = data.slug;
    this.art_keywords = data.art_keywords;
    this.category_id = data.category_id;
    this.status_id = data.status_id;
    this.category = data.category ? new CategoryVm(data.category) : null;
    this.users = data.users?.map((user: any) => new UserMinVm(user)) || [];
  }
}

export class ArticleMinVm {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  art_title: string;

  @ApiResponseProperty()
  art_sub_title?: string;

  @ApiResponseProperty()
  slug: string;

  @ApiResponseProperty()
  category?: CategoryVm;

  @ApiResponseProperty()
  created_at: Date;

  constructor(data: any) {
    this.id = data.id;
    this.art_title = data.art_title;
    this.art_sub_title = data.art_sub_title;
    this.slug = data.slug;
    this.category = data.category ? new CategoryVm(data.category) : null;
    this.created_at = data.created_at;
  }
}
