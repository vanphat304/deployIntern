import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StudentLikeJob } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentLikeJobService {
  constructor(private prisma: PrismaService) {}

  async studentLikeJob(dto: StudentLikeJob) {
    try {
      let result = await this.prisma.studentLikeJob.create({
        data: {
          ...dto,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async studentUnLikeJob(dto: StudentLikeJob) {
    const { jobId, studentId } = dto;
    try {
      let result = await this.prisma.studentLikeJob.delete({
        where: {
          jobId_studentId: {
            jobId,
            studentId,
          },
        },
      });

      return result;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
}
