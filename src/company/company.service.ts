import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Company, District, Province, SpecializeCompany } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async addCompany(data: Company) {
    try {
      const company: Company = await this.prisma.company.create({
        data,
      });
      return company;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListCompanyCount() {
    return await this.prisma.company.count();
  }

  async getListCompany(query): Promise<Array<Company>> {
    try {
      const { pageNumber, pageSize, searchItem } = query;

      const listCompany: Array<Company> = await this.prisma.company.findMany({
        skip: (pageNumber - 1) * pageSize || 0,
        take: pageSize * 1 || 10,
        where: {
          isStudentProp: false,
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

      return listCompany.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  
  async getListCompanyAll(query): Promise<Array<Company>> {
    try {
      const { pageNumber, pageSize, searchItem } = query;

      const listCompany: Array<Company> = await this.prisma.company.findMany({
        where: {
          isStudentProp: false,
        },
      });

      return listCompany.sort((a, b) => {
        return (b.createdAt as any) - (a.createdAt as any);
      });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListSpecialize() {
    try {
      const listSpecializeCompany: Array<SpecializeCompany> =
        await this.prisma.specializeCompany.findMany();

      return listSpecializeCompany;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListDistrict() {
    try {
      const listDistrict: Array<District> = await this.prisma.district.findMany();
      return listDistrict;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListProvince() {
    try {
      const listProvince: Array<Province> = await this.prisma.province.findMany();
      return listProvince;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getListCompanyByParams(): Promise<Array<Pick<Company, 'id' | 'nameCompany'>>> {
    try {
      const listCompany: Array<Pick<Company, 'id' | 'nameCompany'>> =
        await this.prisma.company.findMany({
          where: {
            isStudentProp: false,
          },
          select: {
            id: true,
            nameCompany: true,
          },
        });

      return listCompany;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async getCompanyById(id: string): Promise<Company> {
    try {
      const Company: Company = await this.prisma.company.findFirst({
        where: {
          id,
        },
      });
      return Company;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCompany(dto: Company) {
    try {
      const { id, ...rest } = dto;
      const result = await this.prisma.company.update({
        where: {
          id,
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
  async deleteCompany(id: string) {
    try {
      const result = await this.prisma.company.delete({
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
}
