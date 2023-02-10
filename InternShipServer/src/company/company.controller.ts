import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addCompany(@Body() dto: Company): Promise<Company> {
    console.log({ dto });

    return this.companyService.addCompany(dto);
  }
  @Get()
  getListCompany(@Query() query): Promise<Company[]> {
    return this.companyService.getListCompany(query);
  }

  @Get('params')
  getListCompanyDrop(): Promise<Array<Pick<Company, 'id' | 'nameCompany'>>> {
    return this.companyService.getListCompanyByParams();
  }

  @Get(':id')
  getCompanyById(@Param('id') id: string): Promise<Company> {
    return this.companyService.getCompanyById(id);
  }
  @Put('update')
  updateCompany(@Body() dto: Company) {
    return this.companyService.updateCompany(dto);
  }
  @Delete(':id')
  deleteCompany(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}
