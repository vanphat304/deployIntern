import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StudentProposal } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentProposalService {
  constructor(private prisma: PrismaService) {}

  async addStudentProposal(dto: StudentProposal) {
    try {
      const StudentProposal: StudentProposal = await this.prisma.studentProposal.create({
        data: {
          ...dto,
        },
      });
      return StudentProposal;
    } catch (error) {
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListStudentProposal(query): Promise<Array<StudentProposal>> {
    try {
      const { pageNumber, pageSize, searchItem, studentId } = query;

      const listStudentProposal: Array<StudentProposal> =
        await this.prisma.studentProposal.findMany({
          skip: (pageNumber - 1) * pageSize || 0,
          take: pageSize * 1 || 10,
          where: {
            studentId: {
              contains: studentId || '',
            },
            OR: [
              {
                nameCompany: {
                  mode: 'insensitive',
                  contains: searchItem || '',
                },
              },
            ],
          },
        });
      return listStudentProposal;
    } catch (error) {
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getStudentProposalById(id: string): Promise<StudentProposal> {
    try {
      const StudentProposal: StudentProposal = await this.prisma.studentProposal.findFirst({
        where: {
          id,
        },
      });
      return StudentProposal;
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

  async updateStudentProposal(dto: StudentProposal) {
    const { id, ...rest } = dto;
    try {
      const result = await this.prisma.studentProposal.update({
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
          throw new HttpException(
            `không thể tìm thấy thông tin với id ${id}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  async approveStudentProposal(id: string) {
    try {
      const result = await this.prisma.studentProposal.update({
        where: {
          id,
        },
        data: {
          status: 'APPROPVED',
        },
      });
      if (result) {
        const props = await this.prisma.studentProposal.findUnique({
          where: {
            id,
          },
        });
        const { studentId, nameCompany } = props;
        await this.prisma.notificationStudent.create({
          data: {
            studentId,
            content: `Thông tin mô tả thực tập của bạn ở công ty ${nameCompany} đã được chấp nhận`,
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

  async rejectStudentProposal(id: string, { reasonReject }: Pick<StudentProposal, 'reasonReject'>) {
    try {
      const result = await this.prisma.studentProposal.update({
        where: {
          id,
        },
        data: {
          status: 'REJECTED',
          reasonReject,
        },
      });
      if (result) {
        const props = await this.prisma.studentProposal.findUnique({
          where: {
            id,
          },
        });
        const { studentId, nameCompany } = props;
        await this.prisma.notificationStudent.create({
          data: {
            studentId,
            content: `Thông tin mô tả thực tập của bạn ở công ty ${nameCompany} vừa bị từ chối`,
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

  async deleteStudentProposal(id: string) {
    try {
      const result = await this.prisma.studentProposal.delete({
        where: {
          id,
        },
      });
      console.log(result);
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
