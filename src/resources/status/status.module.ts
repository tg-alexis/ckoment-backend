import { Module } from '@nestjs/common';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  controllers: [StatusController],
  providers: [
    StatusService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.STATUS,
    },
  ],
  exports: [StatusService],
})
export class StatusModule {}
