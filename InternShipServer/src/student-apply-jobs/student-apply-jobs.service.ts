import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StudentApplyJob } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentApplyJobsService {
  constructor(private prisma: PrismaService) {}

  async addStudentApplyJob(dto: StudentApplyJob) {
    try {
      const StudentApplyJob: StudentApplyJob = await this.prisma.studentApplyJob.create({
        data: {
          ...dto,
        },
      });
      return StudentApplyJob;
    } catch (error) {
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListStudentApplyJob(query): Promise<Array<StudentApplyJob>> {
    const { searchItem, pageSize, pageNumber } = query;

    try {
      const listStudentApplyJob: Array<StudentApplyJob> =
        await this.prisma.studentApplyJob.findMany({
          skip: (pageNumber - 1) * pageSize || 0,
          take: pageSize * 1 || 10,
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            jobDecription: {
              select: {
                jobTitle: true,
                company: {
                  select: {
                    nameCompany: true,
                  },
                },
              },
            },
          },
          // where: {
          //   OR: [
          //     {
          //       student: {
          //         OR: [
          //           {
          //             firstName: {
          //               contains: searchItem || '',
          //             },
          //             lastName: {
          //               contains: searchItem || '',
          //             },
          //           },
          //         ],
          //       },
          //     },
          //   ],
          // },
        });

      return listStudentApplyJob;
    } catch (error) {
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getStudentApplyJobById(id: string): Promise<StudentApplyJob> {
    try {
      const StudentApplyJob: StudentApplyJob = await this.prisma.studentApplyJob.findFirst({
        where: {
          id,
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              identifierStudent:true
            },
          },
          jobDecription: {
            select: {
              jobTitle: true,
              company: {
                select: {
                  nameCompany: true,
                },
              },
            },
          },
        },
      });

      if (!StudentApplyJob) {
        throw new HttpException(`can't find StudentApplyJob with id ${id}`, HttpStatus.BAD_REQUEST);
      }

      return StudentApplyJob;
    } catch (error) {
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async updateStudentApplyJob(dto: StudentApplyJob) {
    try {
      const { id, ...rest } = dto;
      const result = await this.prisma.studentApplyJob.update({
        where: {
          id,
        },
        data: {
          ...rest,
        },
      });
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2003')) {
          throw new HttpException(`không thể cập nhật tin công ty`, HttpStatus.BAD_REQUEST);
        }
      }
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteStudentApplyJob(id: string) {
    try {
      const result = await this.prisma.studentApplyJob.delete({
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2003')) {
          throw new HttpException(`không thể xóa thông tin công ty`, HttpStatus.BAD_REQUEST);
        }
      }
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async approveStudentApplyJob(id: string) {
    try {
      const result = await this.prisma.studentApplyJob.update({
        where: {
          id,
        },
        data: {
          status: 'APPROPVED',
        },
      });
      if (result) {
        const props = await this.prisma.studentApplyJob.findUnique({
          where: {
            id,
          },
        });
        const { studentId, jobId } = props;
        await this.prisma.notificationStudent.create({
          data: {
            studentId,
            content: `Thông tin ứng tuyển thực tập của bạn ở công việc ${jobId} đã được chấp nhận`,
          },
        });
      }
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2003')) {
          throw new HttpException(
            `không thể tìm thấy thông tin với id ${id}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async rejectStudentApplyJob(id: string, { reasonReject }: Pick<StudentApplyJob, 'reasonReject'>) {
    try {
      const result = await this.prisma.studentApplyJob.update({
        where: {
          id,
        },
        data: {
          status: 'REJECTED',
          reasonReject,
        },
      });
      if (result) {
        const props = await this.prisma.studentApplyJob.findUnique({
          where: {
            id,
          },
        });
        const { studentId, jobId } = props;
        await this.prisma.notificationStudent.create({
          data: {
            studentId,
            content: `Thông tin ứng tuyển thực tập của bạn cho bị trí ${jobId} vừa bị từ chối`,
            note: reasonReject,
          },
        });
      }
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2003')) {
          throw new HttpException(
            `không thể tìm thấy thông tin với id ${id}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
}
