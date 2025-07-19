import { ApiResponseProperty } from '@nestjs/swagger';
import { BasicEntity } from 'src/commons/shared/entities/basic.entity';

export class StatusEntity extends BasicEntity {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description?: string;

  constructor(data: any) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }
}
