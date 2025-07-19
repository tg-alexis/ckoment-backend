import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class CreateStatusDto {
  @ApiProperty({
    description: 'Nom du statut',
    example: 'Publié',
  })
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MaxLength(255, { message: 'Le nom ne doit pas dépasser 255 caractères' })
  @IsUnique(ModelMappingTable.STATUS, 'name', {
    message: 'Un statut avec ce nom existe déjà',
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Description du statut',
    example: 'Article publié et visible par tous',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  description?: string;
}
