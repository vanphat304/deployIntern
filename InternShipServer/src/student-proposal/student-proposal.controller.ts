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
import { StudentProposal } from '@prisma/client';
import { StudentProposalService } from './student-proposal.service';

@Controller('student-proposal')
export class StudentProposalController {
  constructor(private studentProposal: StudentProposalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addStudentProposal(@Body() dto: StudentProposal): Promise<StudentProposal> {
    return this.studentProposal.addStudentProposal(dto);
  }
  @Get()
  getListStudentProposal(@Query() query): Promise<StudentProposal[]> {
    return this.studentProposal.getListStudentProposal(query);
  }
  @Get(':id')
  getStudentProposalById(@Param('id') id: string): Promise<StudentProposal> {
    return this.studentProposal.getStudentProposalById(id);
  }
  @Put('update')
  updateStudentProposal(@Body() dto: StudentProposal) {
    return this.studentProposal.updateStudentProposal(dto);
  }
  @Delete(':id')
  deleteStudentProposal(@Param('id') id: string) {
    return this.studentProposal.deleteStudentProposal(id);
  }
  @Put('approve/:id')
  approveStudentProposal(@Param('id') id: string) {
    return this.studentProposal.approveStudentProposal(id);
  }
  @Put('reject/:id')
  rejectStudent(@Param('id') id: string, @Body() reasonReject: Pick<StudentProposal, 'reasonReject'>) {
    return this.studentProposal.rejectStudentProposal(id, reasonReject);
  }
}
