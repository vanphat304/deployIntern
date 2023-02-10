import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Company, STATUS, StudentProposal } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentProposalService {
  constructor(private prisma: PrismaService) {}

  async addStudentProposal(dto: StudentProposal) {
    try {
      const isSubmit = await this.prisma.studentProposal.findFirst({
        where: {
          studentId: {
            equals: dto.studentId,
          },
        },
      });

      if (isSubmit && isSubmit.status === STATUS.SUMBMITED) {
        throw new HttpException(
          `Công ty ${
            isSubmit.nameCompany.toString().substring(0, 12) + '...'
          } đang được xem xét , vui lòng chờ kết quả trước khi để xuất thêm công ty`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const StudentProposal: StudentProposal = await this.prisma.studentProposal.create({
        data: {
          ...dto,
        },
      });
      return StudentProposal;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListStudentProposalCount() {
    return await this.prisma.studentProposal.count();
  }

  async getListStudentProposal(query): Promise<Array<StudentProposal>> {
    try {
      const { pageNumber, pageSize, searchItem, identifierStudent } = query;

      const listStudentProposal: Array<StudentProposal> =
        await this.prisma.studentProposal.findMany({
          skip: (pageNumber - 1) * pageSize || 0,
          take: pageSize * 1 || 10,
          include: {
            student: {
              select: {
                identifierStudent: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          where: {
            student: {
              identifierStudent: {
                contains: identifierStudent || '',
              },
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
      return listStudentProposal.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getStudentProposalById(id: string): Promise<StudentProposal> {
    try {
      const StudentProposal: StudentProposal = await this.prisma.studentProposal.findFirst({
        where: {
          OR: [
            {
              studentId: id,
            },
            {
              id,
            },
          ],
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
      const isSubmit = await this.prisma.studentProposal.findFirst({
        where: {
          studentId: {
            equals: dto.studentId,
          },
        },
      });

      if (isSubmit && isSubmit.status === STATUS.SUMBMITED) {
        throw new HttpException(
          `Công ty ${
            isSubmit.nameCompany.toString().substring(0, 20) + '...'
          } đang chờ phê duyệt vùi lòng chờ kết quả trước khi cập nhật thông tin`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.prisma.studentProposal.update({
        where: {
          id,
        },
        data: {
          ...rest,
          status: STATUS.SUMBMITED,
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
        const {
          studentId,
          nameCompany,
          addressCompany,
          speacialize,
          introduceCompany,
          linkWebsite,
          scale,
          addressDistrictId,
          addressProvinceId,
        } = props;
        let company: Company = await this.prisma.company.create({
          data: {
            nameCompany: nameCompany,
            logo: linkWebsite,
            banner: null,
            scale: scale,
            website: linkWebsite,
            specializeCompanyId: speacialize,
            address: addressCompany,
            isStudentProp: true,
            addressProvinceId,
            addressDistrictId,
            introduce: introduceCompany,
            rating: 0,
          },
        });

        const { id: companyId } = company;

        await this.prisma.studentWorkCompany.create({
          data: {
            companyId,
            decription: 'Sinh viên tự để xuất',
            rating: 'NONE',
            studentId: studentId,
          },
        });

        await this.prisma.notificationStudent.create({
          data: {
            studentId,
            content: `Công ty ${nameCompany} do bạn để xuất đã được chấp nhận`,
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
