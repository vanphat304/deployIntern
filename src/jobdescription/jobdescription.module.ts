import { Module } from '@nestjs/common';
import { JobdescriptionController } from './jobdescription.controller';
import { JobDescriptionService } from './jobdescription.service';

@Module({
  controllers: [JobdescriptionController],
  providers: [JobDescriptionService],
})
export class JobdescriptionModule {}
