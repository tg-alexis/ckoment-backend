import { ApiResponseProperty } from '@nestjs/swagger';
import { BasicEntity } from 'src/commons/shared/entities/basic.entity';

export class MagazineEntity extends BasicEntity {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  mag_title: string;

  @ApiResponseProperty()
  mag_description?: string;

  @ApiResponseProperty()
  slug: string;

  @ApiResponseProperty()
  status_id?: string;

  @ApiResponseProperty()
  user_id: string;

  // Relations
  @ApiResponseProperty()
  status?: any;

  @ApiResponseProperty()
  user?: any;

  constructor(data: any) {
    super();
    this.id = data.id;
    this.mag_title = data.mag_title;
    this.mag_description = data.mag_description;
    this.slug = data.slug;
    this.status_id = data.status_id;
    this.user_id = data.user_id;
    this.status = data.status;
    this.user = data.user;
  }
}
