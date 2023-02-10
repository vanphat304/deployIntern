import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StudentWorkCompany } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentWorkCompanyService {
  constructor(private prisma: PrismaService) {}
  async addStudentWorkCompany(dto: StudentWorkCompany) {
    try {
      const StudentWorkCompany: StudentWorkCompany = await this.prisma.studentWorkCompany.create({
        data: {
          ...dto,
        },
      });
      return StudentWorkCompany;
    } catch (error) {
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListStudentWorkCompany(): Promise<Array<StudentWorkCompany>> {
    try {
      const listStudentWorkCompany: Array<StudentWorkCompany> =
        await this.prisma.studentWorkCompany.findMany();

      return listStudentWorkCompany;
    } catch (error) {
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getStudentWorkCompanyById(studentId: string): Promise<StudentWorkCompany> {
    try {
      const StudentWorkCompany: StudentWorkCompany = await this.prisma.studentWorkCompany.findFirst(
        {
          where: {
            studentId,
          },
        },
      );
      return StudentWorkCompany;
    } catch (error) {
      console.log(error);
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
      return result;
    } catch (error) {
      console.log(error);
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
      console.log(error);
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
}
