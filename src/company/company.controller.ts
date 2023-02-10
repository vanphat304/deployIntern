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
  UseGuards,
} from '@nestjs/common';
import { Company, District, Province, Role, SpecializeCompany } from '@prisma/client';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/rolesGuard/roles.decorator';
import { RolesGuard } from 'src/auth/rolesGuard/roles.guard';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  addCompany(@Body() dto: Company): Promise<Company> {
    return this.companyService.addCompany(dto);
  }
  @Get('')
  getListCompany(@Query() query): Promise<Company[]> {
    return this.companyService.getListCompany(query);
  }
  
  @Get('all')
  getListCompanyAll(@Query() query): Promise<Company[]> {
    return this.companyService.getListCompanyAll(query);
  }
  
  @Get('count')
  getListCompanyCount(@Query() query): Promise<number> {
    return this.companyService.getListCompanyCount();
  }

  @Get('/specialize')
  getListSpecialize(): Promise<SpecializeCompany[]> {
    return this.companyService.getListSpecialize();
  }
  @Get('/district')
  getListDistrict(): Promise<District[]> {
    return this.companyService.getListDistrict();
  }

  @Get('/province')
  getListProvince(): Promise<Province[]> {
    return this.companyService.getListProvince();
  }

  @Get('/params')
  getListCompanyDrop(): Promise<Array<Pick<Company, 'id' | 'nameCompany'>>> {
    return this.companyService.getListCompanyByParams();
  }

  @Get(':id')
  getCompanyById(@Param('id') id: string): Promise<Company> {
    return this.companyService.getCompanyById(id);
  }
  @Put('update')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  updateCompany(@Body() dto: Company) {
    return this.companyService.updateCompany(dto);
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  deleteCompany(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}
