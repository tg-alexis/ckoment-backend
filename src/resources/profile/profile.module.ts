import { Module } from '@nestjs/common';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { PrismaService } from 'src/commons/services/prisma.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [
    PrismaService,
    ProfileService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.PROFILE,
    },
  ],
})
export class ProfileModule {}
