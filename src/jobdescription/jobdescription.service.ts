import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JobDecripton } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReqParams } from './dto';

@Injectable()
export class JobDescriptionService {
  constructor(private prisma: PrismaService) {}

  async addJobDecripton(dto: JobDecripton) {
    try {
      const JobDecripton: JobDecripton = await this.prisma.jobDecripton.create({
        data: {
          ...dto,
        },
      });
      return JobDecripton;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2003')) {
          throw new HttpException(
            `không thể tìm thấy thông tin công ty đã chọn ${dto.companyId}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListJobDecriptonCount() {
    return this.prisma.jobDecripton.count();
  }
  async getListJobDecriptonCountNumberApply(jobId) {
    return this.prisma.jobDecripton.count({
      where: {
        jobId,
      },
    });
  }

  async getListJobDecripton(query): Promise<Array<JobDecripton>> {
    try {
      const { pageNumber, pageSize, searchItem, companyId } = query;

      const listJobDecripton: Array<JobDecripton> = await this.prisma.jobDecripton.findMany({
        skip: (pageNumber - 1) * pageSize || 0,
        take: pageSize * 1 || 10,
        include: {
          company: {
            select: {
              nameCompany: true,
            },
          },
        },
        where: {
          companyId: {
            contains: companyId,
          },

          OR: [
            {
              company: {
                nameCompany: {
                  mode: 'insensitive',
                  contains: searchItem || '',
                },
              },
            },
            {
              jobTitle: {
                mode: 'insensitive',
                contains: searchItem || '',
              },
            },
          ],
        },
      });

      return listJobDecripton.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw error;
    }
  }

  async getJobDecriptonById(id): Promise<JobDecripton> {
    try {
      const JobDecripton: JobDecripton = await this.prisma.jobDecripton.findFirst({
        where: {
          jobId: id,
        },
        include: {
          company: {
            select: {
              logo: true,
              nameCompany: true,
            },
          },
        },
      });
      if (!JobDecripton) {
        throw new HttpException(`can't find Job description with id ${id}`, HttpStatus.BAD_REQUEST);
      }
      return JobDecripton;
    } catch (error) {
      throw error;
    }
  }

  async updateJobDecripton(dto: JobDecripton) {
    try {
      const { jobId, company, ...rest } = { ...dto, company: '' } || {};
      const result = await this.prisma.jobDecripton.update({
        where: {
          jobId,
        },
        data: {
          ...rest,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteJobDecripton(id: string) {
    try {
      const result = await this.prisma.jobDecripton.delete({
        where: {
          jobId: id,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(`can't find Job Description with id ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getListJobDesByCompanyId(reqParams: ReqParams) {
    try {
      const results = await this.prisma.jobDecripton.findMany({
        where: {
          companyId: reqParams.companyId,
        },
        include: {
          company: {
            select: {
              nameCompany: true,
              logo: true,
              address: true,
              Province: {
                select: {
                  name: true,
                },
              },
            },
          },
          StudentLikeJob: {
            select: {
              studentId: true,
            },
          },
        },
      });

      if (!results) {
        throw new HttpException(
          `can't find Job Description with companyId ${reqParams.companyId}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return results.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw error;
    }
  }
  async getListJobDesLiked(reqParams: ReqParams) {
    try {
      const results = await this.prisma.jobDecripton.findMany({
        where: {
          StudentLikeJob: {
            some: {
              studentId: reqParams.studentId,
            },
          },
        },
        include: {
          company: {
            select: {
              nameCompany: true,
              logo: true,
              address: true,
              Province: {
                select: {
                  name: true,
                },
              },
            },
          },
          StudentLikeJob: {
            select: {
              studentId: true,
            },
          },
        },
      });

      if (!results) {
        throw new HttpException(
          `can't find Job Description with student ${reqParams.studentId}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return results.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw error;
    }
  }

  async getListJobWithCompany(query) {
    const {
      search: { addressDistrictId, addressProvinceId, searchItem, specializeCompanyId },
    } = query;

    try {
      const results = await this.prisma.jobDecripton.findMany({
        where: {
          jobTitle: {
            contains: searchItem || '',
          },
          company: {
            addressDistrictId: {
              contains: addressDistrictId || '',
            },
            addressProvinceId: {
              contains: addressProvinceId || '',
            },
            specializeCompanyId: {
              contains: specializeCompanyId || '',
            },
          },
        },
        include: {
          company: {
            select: {
              nameCompany: true,
              logo: true,
              address: true,
            },
          },
          StudentLikeJob: {
            select: {
              studentId: true,
            },
          },
        },
      });
      return results.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
}
