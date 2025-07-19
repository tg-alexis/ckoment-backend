import { ApiResponseProperty } from '@nestjs/swagger';
import { BaseVm } from './base.vm';

export class ProfileVm extends BaseVm {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.libelle = data.libelle;
  }

  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  libelle: string;

  @ApiResponseProperty()
  description?: string;
}
