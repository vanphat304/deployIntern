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
import { JobDecripton, Role } from '@prisma/client';
import { ReqParams } from './dto';
import { JobDescriptionService } from './jobdescription.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/rolesGuard/roles.guard';
import { Roles } from 'src/auth/rolesGuard/roles.decorator';

@Controller('jobdescription')
export class JobdescriptionController {
  constructor(private jobDescription: JobDescriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwtGuard'))
  addJobDecripton(@Body() dto: JobDecripton): Promise<JobDecripton> {
    return this.jobDescription.addJobDecripton(dto);
  }
  @Get()
  getListJobDecripton(@Query() query): Promise<JobDecripton[]> {
    return this.jobDescription.getListJobDecripton(query);
  }
  @Get('count')
  getListJobDecriptonCount(): Promise<number> {
    return this.jobDescription.getListJobDecriptonCount();
  }
  @Get('count-number-apply/:id')
  getListJobDecriptonCountNumber(@Param('id') id: string): Promise<number> {
    return this.jobDescription.getListJobDecriptonCountNumberApply(id);
  }
  @Get('/job-company')
  getListJobCompany(@Query() query) {
    return this.jobDescription.getListJobWithCompany(query);
  }
  @Get('filter')
  getListJobDesByCompanyId(@Query() reqParams): Promise<JobDecripton[]> {
    return this.jobDescription.getListJobDesByCompanyId(reqParams);
  }
  @Get('like')
  @UseGuards(AuthGuard('jwtGuard'))
  getListJobDesByStudentLiked(@Query() reqParams): Promise<JobDecripton[]> {
    return this.jobDescription.getListJobDesLiked(reqParams);
  }
  @Get(':id')
  getJobDecriptonById(@Param('id') id: string): Promise<JobDecripton> {
    return this.jobDescription.getJobDecriptonById(id);
  }

  @Put('update')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  updateJobDecripton(@Body() dto: JobDecripton) {
    return this.jobDescription.updateJobDecripton(dto);
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  deleteJobDecripton(@Param('id') id: string) {
    return this.jobDescription.deleteJobDecripton(id);
  }
}
