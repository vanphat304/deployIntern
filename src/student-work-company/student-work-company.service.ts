import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StudentWorkCompany } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RATINGS } from './rating/rating.rate';

@Injectable()
export class StudentWorkCompanyService {
  constructor(private prisma: PrismaService) {}
  async addStudentWorkCompany(idJobApply: string, dto: StudentWorkCompany) {
    try {
      const StudentWorkCompany: StudentWorkCompany = await this.prisma.studentWorkCompany.create({
        data: {
          ...dto,
        },
      });

      const { studentId } = StudentWorkCompany;

      await this.prisma.studentApplyJob.update({
        where: {
          id: idJobApply,
        },
        data: {
          status: 'WORKED',
        },
      });

      await this.prisma.studentApplyJob.updateMany({
        where: {
          studentId,
          OR: [
            {
              status: 'APPROPVED',
            },
            {
              status: 'SUMBMITED',
            },
          ],
        },
        data: {
          status: 'NOT_WORKED',
        },
      });

      return StudentWorkCompany;
    } catch (error) {
      console.log({ error });

      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListStudentWorkCompany(query): Promise<Array<StudentWorkCompany>> {
    const { studentId, companyId, pageSize, pageNumber } = query;

    try {
      const listStudentWorkCompany: Array<StudentWorkCompany> =
        await this.prisma.studentWorkCompany.findMany({
          skip: (pageNumber - 1) * pageSize || 0,
          take: pageSize * 1 || 10,
          include: {
            company: true,
            student: true,
          },
          where: {
            companyId: {
              contains: companyId || '',
            },
            studentId: {
              contains: studentId || '',
            },
          },
        });

      return listStudentWorkCompany;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getTotalRecord() {
    return await this.prisma.studentWorkCompany.count();
  }

  async getStudentWorkCompanyById(studentId: string): Promise<StudentWorkCompany> {
    try {
      const StudentWorkCompany: StudentWorkCompany = await this.prisma.studentWorkCompany.findFirst(
        {
          where: {
            studentId,
          },
          include: {
            company: {
              select: {
                nameCompany: true,
                logo: true,
                id: true,
              },
            },
            student: {
              select: {
                identifierStudent: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      );
      return StudentWorkCompany;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async updateStudentWorkCompany(dto: StudentWorkCompany) {
    try {
      const { studentId, ...rest } = dto;
      const result = await this.prisma.studentWorkCompany.update({
        where: {
          studentId,
        },
        data: {
          ...rest,
        },
      });

      const { companyId } = result;

      const list = await this.prisma.studentWorkCompany.findMany();
      const score = list.reduce((prev: any, curr: any) => {
        return prev + RATINGS.find((item) => item.id === curr.rating)?.value || 1;
      }, 0);

      const numberStudent = await this.prisma.studentWorkCompany.count({
        where: {
          companyId,
        },
      });
      await this.prisma.company.update({
        where: {
          id: companyId,
        },
        data: {
          rating: score / numberStudent,
        },
      });

      return result;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteStudentWorkCompany(studentId: string) {
    try {
      const result = await this.prisma.studentWorkCompany.delete({
        where: {
          studentId,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
}
