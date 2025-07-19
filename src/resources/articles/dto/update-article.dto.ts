import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({
    description: "ID du statut de l'article",
    example: 'ckm123456789',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: "L'ID du statut doit être un UUID valide" })
  @IsDataExists(ModelMappingTable.STATUS, 'id', {
    message: "Ce statut n'existe pas",
  })
  status_id?: string;

  @ApiProperty({
    description: 'Raison de la modification',
    example: "Correction d'une erreur typographique",
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La raison doit être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  update_reason?: string;
}
