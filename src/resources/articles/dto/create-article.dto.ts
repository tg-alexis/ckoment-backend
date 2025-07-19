import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class CreateArticleDto {
  @ApiProperty({
    description: "Titre de l'article",
    example: 'Comment développer une API avec NestJS',
  })
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  @IsString({ message: 'Le titre doit être une chaîne de caractères' })
  @MaxLength(255, { message: 'Le titre ne doit pas dépasser 255 caractères' })
  @IsUnique(ModelMappingTable.ARTICLE, 'art_title', {
    message: 'Un article avec ce titre existe déjà',
  })
  @Transform(({ value }) => value?.trim())
  art_title: string;

  @ApiProperty({
    description: "Sous-titre de l'article",
    example: 'Guide complet pour débutants',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le sous-titre doit être une chaîne de caractères' })
  @MaxLength(255, {
    message: 'Le sous-titre ne doit pas dépasser 255 caractères',
  })
  @Transform(({ value }) => value?.trim())
  art_sub_title?: string;

  @ApiProperty({
    description: "Description/contenu de l'article",
    example: 'Dans cet article, nous allons voir comment...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  art_description?: string;

  @ApiProperty({
    description: 'Mots-clés pour le SEO',
    example: 'nestjs, api, typescript, nodejs',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Les mots-clés doivent être une chaîne de caractères' })
  @MaxLength(255, {
    message: 'Les mots-clés ne doivent pas dépasser 255 caractères',
  })
  @Transform(({ value }) => value?.trim())
  art_keywords?: string;

  @ApiProperty({
    description: 'ID de la catégorie',
    example: 'ckm123456789',
  })
  @IsNotEmpty({ message: 'La catégorie est obligatoire' })
  @IsUUID(4, { message: "L'ID de la catégorie doit être un UUID valide" })
  @IsDataExists(ModelMappingTable.CATEGORY, 'id', {
    message: "Cette catégorie n'existe pas",
  })
  category_id: string;

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
}
