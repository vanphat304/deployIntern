import { Module } from '@nestjs/common';
import { StudentProposalController } from './student-proposal.controller';
import { StudentProposalService } from './student-proposal.service';

@Module({
  controllers: [StudentProposalController],
  providers: [StudentProposalService],
})
export class StudentProposalModule {}
