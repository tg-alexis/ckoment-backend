import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is the admin active?',
    example: true,
  })
  is_active: boolean;
}
