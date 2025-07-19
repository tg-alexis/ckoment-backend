import { Module } from '@nestjs/common';
import { RandomService } from 'src/commons/services/random.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RandomService],
  exports: [AuthService, RandomService],
})
export class AuthModule {}
