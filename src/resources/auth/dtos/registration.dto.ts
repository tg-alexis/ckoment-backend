import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class RegistrationDTO {
  @IsUnique(ModelMappingTable.USER, 'email', {
    message: 'Un compte existe déjà avec cette adresse email !',
  })
  @IsString()
  @ApiProperty({
    description: 'Adresse email',
    example: 'johndoe@gmail.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Prénoms',
    example: 'John',
  })
  prenoms: string;

  @IsString()
  @ApiProperty({
    description: 'Noms de famille',
    example: 'Doe',
  })
  noms: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Numéro de contact',
    example: '+33612345678',
    required: false,
  })
  contact?: string;

  @IsUUID(4, { message: "L'ID du profil doit être un UUID valide" })
  @IsDataExists(ModelMappingTable.PROFILE, 'id', {
    message: "Ce profil n'existe pas",
  })
  @ApiProperty({
    description: 'ID du profil utilisateur',
    example: 'ckm123456789',
  })
  profile_id: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
    },
  )
  @ApiProperty({
    description: 'Mot de passe',
    example: 'Password@123',
  })
  password: string;
}
