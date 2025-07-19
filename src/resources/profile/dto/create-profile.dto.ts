import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class CreateProfileDto {
  @IsString()
  @IsUnique(ModelMappingTable.PROFILE, 'libelle', {
    message: 'Un profile avec ce nom existe déjà.',
  })
  @ApiProperty({
    description: 'Profile name',
    example: 'Profile 1',
  })
  libelle: string;

  @IsString()
  @ApiProperty({
    description: 'Profile description',
    example: 'Profile 1 description',
  })
  description: string;
}
