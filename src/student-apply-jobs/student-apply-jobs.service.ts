import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { STATUS, StudentApplyJob } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';
import { ImportExportService } from 'src/import-export/import-export.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentApplyJobsService {
  constructor(private prisma: PrismaService, private exportExcel: ImportExportService) {}

  async addStudentApplyJob(dto: StudentApplyJob) {
    try {
      const StudentApplyJob: StudentApplyJob = await this.prisma.studentApplyJob.create({
        data: {
          ...dto,
        },
      });
      return StudentApplyJob;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async exportStudentApply(res: Response, query) {
    const { searchItem, pageSize, pageNumber, studentId, companyId, status } = query;

    try {
      const listStudentApplyJob: Array<StudentApplyJob> =
        await this.prisma.studentApplyJob.findMany({
          skip: (pageNumber - 1) * pageSize || 0,
          take: pageSize * 1 || 10,
          where: {
            AND: [
              {
                student: {
                  id: {
                    contains: studentId || '',
                  },
                },
              },
              {
                status: {
                  equals: status as STATUS,
                },
              },
              {
                jobDecription: {
                  company: {
                    id: {
                      contains: companyId || '',
                    },
                  },
                },
              },
            ],
          },
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                identifierStudent: true,
              },
            },
            jobDecription: {
              select: {
                jobTitle: true,
                jobId: true,
                company: {
                  select: {
                    nameCompany: true,
                  },
                },
              },
            },
          },
        });

      return this.exportExcel.exportExcel(
        res,
        listStudentApplyJob
          .sort((a, b) => {
            return (b.dateAppply as any) - (a.dateAppply as any);
          })
          .map((item: any) => ({
            'MÃ SỐ SINH VIÊN': item.student.identifierStudent,
            jobId: item.jobDecription.jobId,
            'TRẠNG THÁI': item.status,
            'LÝ DO TỪ CHỐI': item.reasonReject,
            'HỌ TÊN': item.student.lastName + ' ' + item.student.firstName,
            'MÔ TẢ CÔNG VIỆC': item.jobDecription.jobTitle,
            'TÊN CÔNG TY': item.jobDecription.company.nameCompany,
            'NGÀY ỨNG TUYỂN': item.dateAppply,
            'FILE CV': item.fileCV,
            'FILE ĐIỂM': item.fileScore,
          })),
      );
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListStudentApplyJobCount() {
    return await this.prisma.studentApplyJob.count();
  }
  async getListStudentApplyJob(query): Promise<Array<StudentApplyJob>> {
    const { searchItem, pageSize, pageNumber, studentId, companyId, status } = query;

    try {
      const listStudentApplyJob: Array<StudentApplyJob> =
        await this.prisma.studentApplyJob.findMany({
          skip: (pageNumber - 1) * pageSize || 0,
          take: pageSize * 1 || 10,
          where: {
            AND: [
              {
                student: {
                  id: {
                    contains: studentId || '',
                  },
                },
              },
              {
                status: {
                  equals: status as STATUS,
                },
              },
              {
                jobDecription: {
                  company: {
                    id: {
                      contains: companyId || '',
                    },
                  },
                },
              },
            ],
          },
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                identifierStudent: true,
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
      return listStudentApplyJob.sort((a, b) => {
        return (b.dateAppply as any) - (a.dateAppply as any);
      });
    } catch (error) {
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
              identifierStudent: true,
            },
          },
          jobDecription: {
            select: {
              jobTitle: true,
              company: {
                select: {
                  nameCompany: true,
                  logo: true,
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
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  async getStudentApplyJobHistory(id: string): Promise<Array<StudentApplyJob>> {
    try {
      const StudentApplyJobHistories: Array<StudentApplyJob> =
        await this.prisma.studentApplyJob.findMany({
          where: {
            student: {
              id: id,
            },
          },
          include: {
            jobDecription: {
              include: {
                company: {
                  select: {
                    nameCompany: true,
                    logo: true,
                  },
                },
              },
            },
          },
        });

      if (!StudentApplyJobHistories) {
        throw new HttpException(`can't find StudentApplyJob with id ${id}`, HttpStatus.BAD_REQUEST);
      }

      return StudentApplyJobHistories.sort((a, b) => {
        return (b.dateAppply as any) - (a.dateAppply as any);
      });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async checkStudentIsApplied(query): Promise<boolean> {
    const { jobId, studentId } = query;

    try {
      const check: Array<StudentApplyJob> = await this.prisma.studentApplyJob.findMany({
        where: {
          AND: [
            {
              jobId,
            },
            {
              studentId,
            },
          ],
        },
      });

      return check.length !== 0;
    } catch (error) {
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

  async approveStudentApplyJob(id: string, subId?: string) {
    try {
      const studentApplyJob = await this.prisma.studentApplyJob.findFirst({
        where: {
          AND: [
            {
              student: {
                identifierStudent: id,
              },
            },
            {
              jobId: {
                contains: subId || '',
              },
            },
          ],
        },
      });

      const check = await this.prisma.studentApplyJob.findFirst({
        where: {
          id: studentApplyJob?.id ? studentApplyJob?.id : id,
          status: STATUS.SUMBMITED,
        },
      });

      if (check) {
        const result = await this.prisma.studentApplyJob.update({
          where: {
            id: studentApplyJob?.id ? studentApplyJob?.id : id,
          },
          data: {
            status: 'APPROPVED',
          },
        });
        if (result) {
          const props = await this.prisma.studentApplyJob.findUnique({
            where: {
              id: studentApplyJob?.id ? studentApplyJob?.id : id,
            },
          });
          const { studentId, jobId } = props;

          const jobDetail = await this.prisma.jobDecripton.findFirst({
            where: {
              jobId,
            },
            include: {
              company: {
                select: {
                  nameCompany: true,
                },
              },
            },
          });
          const {
            jobTitle,
            company: { nameCompany },
          } = jobDetail;
          await this.prisma.notificationStudent.create({
            data: {
              studentId,
              content: `Bạn vừa được nhận vào làm ở vị trí : ${jobTitle} tại công ty ${nameCompany}  `,
            },
          });
        }
        return result;
      }

      return true;
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

  async rejectStudentApplyJob(
    id: string,
    { reasonReject }: Pick<StudentApplyJob, 'reasonReject'>,
    subId?: string,
  ) {
    try {
      const studentApplyJob = await this.prisma.studentApplyJob.findFirst({
        where: {
          AND: [
            {
              student: {
                identifierStudent: id,
              },
            },
            {
              jobId: {
                contains: subId || '',
              },
            },
          ],
        },
      });

      const check = await this.prisma.studentApplyJob.findFirst({
        where: {
          id: studentApplyJob?.id ? studentApplyJob?.id : id,
          status: STATUS.SUMBMITED,
        },
      });

      if (check) {
        const result = await this.prisma.studentApplyJob.update({
          where: {
            id: studentApplyJob?.id ? studentApplyJob?.id : id,
          },
          data: {
            status: 'REJECTED',
            reasonReject,
          },
        });
        if (result) {
          const props = await this.prisma.studentApplyJob.findUnique({
            where: {
              id: studentApplyJob?.id ? studentApplyJob?.id : id,
            },
          });
          const { studentId, jobId } = props;

          const jobDetail = await this.prisma.jobDecripton.findFirst({
            where: {
              jobId,
            },
            include: {
              company: {
                select: {
                  nameCompany: true,
                },
              },
            },
          });

          const {
            jobTitle,
            company: { nameCompany },
          } = jobDetail;

          await this.prisma.notificationStudent.create({
            data: {
              studentId,
              content: `Thông tin ứng tuyển thực tập của bạn cho bị trí ${jobTitle} tại công ty ${nameCompany} vừa bị từ chối`,
              note: reasonReject,
            },
          });
        }
        return result;
      }
      return true;
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
