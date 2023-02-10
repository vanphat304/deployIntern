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
import { JobDecripton } from '@prisma/client';
import { ReqParams } from './dto';
import { JobDescriptionService } from './jobdescription.service';

@Controller('jobdescription')
export class JobdescriptionController {
  constructor(private jobDescription: JobDescriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addJobDecripton(@Body() dto: JobDecripton): Promise<JobDecripton> {
    return this.jobDescription.addJobDecripton(dto);
  }
  @Get()
  getListJobDecripton(@Query() query): Promise<JobDecripton[]> {
    return this.jobDescription.getListJobDecripton(query);
  }
  @Get('filter')
  getListJobDesByCompanyId(@Query() reqParams): Promise<JobDecripton[]> {
    return this.jobDescription.getListJobDesByCompanyId(reqParams);
  }
  @Get(':id')
  getJobDecriptonById(@Param('id') id: string): Promise<JobDecripton> {
    return this.jobDescription.getJobDecriptonById(id);
  }

  @Put('update')
  updateJobDecripton(@Body() dto: JobDecripton) {
    return this.jobDescription.updateJobDecripton(dto);
  }
  @Delete(':id')
  deleteJobDecripton(@Param('id') id: string) {
    return this.jobDescription.deleteJobDecripton(id);
  }
}
