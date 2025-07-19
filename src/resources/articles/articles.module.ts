import { Module } from '@nestjs/common';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { SlugService } from 'src/commons/services/slug.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    SlugService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.ARTICLE,
    },
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
