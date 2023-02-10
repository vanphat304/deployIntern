import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StudentLikeJobService } from './student-like-job.service';
import { StudentLikeJob } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('student-like-job')
export class StudentLikeJobController {
  constructor(private studentLikeJobService: StudentLikeJobService) {}

  @UseGuards(AuthGuard('jwtGuard'))
  @Post('like')
  studentLikeJob(@Body() dto: StudentLikeJob) {
    return this.studentLikeJobService.studentLikeJob(dto);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Post('unLike')
  StudentUnlikeJob(@Body() dto: StudentLikeJob) {
    return this.studentLikeJobService.studentUnLikeJob(dto);
  }
}
