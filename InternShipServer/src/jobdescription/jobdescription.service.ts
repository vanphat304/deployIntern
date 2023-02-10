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

  async getListJobDecripton(query): Promise<Array<JobDecripton>> {
    try {
      const { pageNumber, pageSize, searchItem, companyId } = query;
      console.log({ query });

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

          companyId:{
            contains:companyId
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

      return listJobDecripton;
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
      });
      if (!JobDecripton) {
        throw new HttpException(`can't find Job description with id ${id}`, HttpStatus.BAD_REQUEST);
      }
      return JobDecripton;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateJobDecripton(dto: JobDecripton) {
    try {
      const { jobId, ...rest } = dto;
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
      console.log({ error });
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
      });

      if (!results) {
        throw new HttpException(
          `can't find Job Description with companyId ${reqParams.companyId}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return results;
    } catch (error) {
      throw error;
    }
  }
}
