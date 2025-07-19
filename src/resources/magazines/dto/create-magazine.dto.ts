import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class CreateMagazineDto {
  @ApiProperty({
    description: 'Titre du magazine',
    example: 'Tech Magazine Janvier 2024',
  })
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  @IsString({ message: 'Le titre doit être une chaîne de caractères' })
  @IsUnique(ModelMappingTable.MAGAZINE, 'mag_title', {
    message: 'Un magazine avec ce titre existe déjà',
  })
  @Transform(({ value }) => value?.trim())
  mag_title: string;

  @ApiProperty({
    description: 'Description du magazine',
    example: 'Magazine mensuel sur les dernières technologies',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  mag_description?: string;

  @ApiProperty({
    description: 'ID du statut du magazine',
    example: 'ckm123456789',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: "L'ID du statut doit être un UUID valide" })
  @IsDataExists(ModelMappingTable.STATUS, 'id', {
    message: "Ce statut n'existe pas",
  })
  status_id?: string;
}
