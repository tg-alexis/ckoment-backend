import { Module } from '@nestjs/common';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.USER,
    },
  ],
})
export class UserModule {}
