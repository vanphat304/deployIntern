import { Module } from '@nestjs/common';
import { StudentLikeJobController } from './student-like-job.controller';
import { StudentLikeJobService } from './student-like-job.service';

@Module({
  controllers: [StudentLikeJobController],
  providers: [StudentLikeJobService]
})
export class StudentLikeJobModule {}
