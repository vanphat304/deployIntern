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
import { Role, StudentProposal } from '@prisma/client';
import { StudentProposalService } from './student-proposal.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/rolesGuard/roles.decorator';
import { RolesGuard } from 'src/auth/rolesGuard/roles.guard';

@Controller('student-proposal')
export class StudentProposalController {
  constructor(private studentProposal: StudentProposalService) {}

  @UseGuards(AuthGuard('jwtGuard'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addStudentProposal(@Body() dto: StudentProposal): Promise<StudentProposal> {
    return this.studentProposal.addStudentProposal(dto);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Get()
  getListStudentProposal(@Query() query): Promise<StudentProposal[]> {
    return this.studentProposal.getListStudentProposal(query);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Get('count')
  getListStudentProposalCount(): Promise<number> {
    return this.studentProposal.getListStudentProposalCount();
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Get(':id')
  getStudentProposalById(@Param('id') id: string): Promise<StudentProposal> {
    return this.studentProposal.getStudentProposalById(id);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Put('update')
  updateStudentProposal(@Body() dto: StudentProposal) {
    return this.studentProposal.updateStudentProposal(dto);
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  @Delete(':id')
  deleteStudentProposal(@Param('id') id: string) {
    return this.studentProposal.deleteStudentProposal(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  @Put('approve/:id')
  approveStudentProposal(@Param('id') id: string) {
    return this.studentProposal.approveStudentProposal(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  @Put('reject/:id')
  rejectStudent(
    @Param('id') id: string,
    @Body() reasonReject: Pick<StudentProposal, 'reasonReject'>,
  ) {
  
    return this.studentProposal.rejectStudentProposal(id, reasonReject);
  }
}
