import { Module } from '@nestjs/common';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.USER,
    },
  ],
})
export class AdminModule {}
