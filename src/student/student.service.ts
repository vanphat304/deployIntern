import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from '@prisma/client';
import { RequestQuery } from 'src/type';
import { AuthService } from 'src/auth/auth.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async getListStudentCount() {
    return await this.prisma.student.count({
      where: {
        role: {
          equals: 'USER',
        },
      },
    });
  }
  async getListStudent(query): Promise<Array<Omit<Student, 'passwordHashed'>>> {
    try {
      const { pageNumber, pageSize, searchItem } = query;
      const listStudent: Array<Omit<Student, 'passwordHashed'>> =
        await this.prisma.student.findMany({
          skip: (pageNumber - 1) * pageSize || 0,
          take: pageSize * 1 || 10,
          where: {
            OR: [
              {
                lastName: {
                  mode: 'insensitive',
                  contains: searchItem || '',
                },
              },
              {
                firstName: {
                  mode: 'insensitive',
                  contains: searchItem || '',
                },
              },
              {
                identifierStudent: {
                  mode: 'insensitive',
                  contains: searchItem || '',
                },
              },
            ],
            AND: [
              {
                role: {
                  in: 'USER',
                },
              },
            ],
          },
        });

      return listStudent.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw error;
    }
  }

  async getStudentById(id: string): Promise<Student> {
    try {
      const student: Student = await this.prisma.student.findFirst({
        where: {
          id,
        },
      });

      if (!student) {
        throw new HttpException(`no have student by id ${id}`, HttpStatus.BAD_REQUEST);
      }

      return student;
    } catch (error) {
      throw error;
    }
  }

  async getStudentByParams(): Promise<
    Array<Pick<Student, 'id' | 'firstName' | 'lastName' | 'identifierStudent'>>
  > {
    try {
      const students = await this.prisma.student.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          identifierStudent: true,
        },
      });
      return students;
    } catch (error) {
      throw error;
    }
  }

  async addNewStudent(dto: Student) {
    try {
      const result = await this.prisma.student.create({
        data: dto,
      });
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2002')) {
          throw new HttpException(
            `Unique constraint failed on the ${error?.meta?.target?.toString()}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw error;
    }
  }

  async updateStudent(dto: Student) {
    try {
      const { id, ...rest } = dto;
      const result = await this.prisma.student.update({
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
        if ((error.code = 'P2002')) {
          throw new HttpException(
            `Unique constraint failed on the ${error?.meta?.target?.toString()}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw error;
    }
  }
  async deleteStudent(id: string) {
    try {
      const result = await this.prisma.student.delete({
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
