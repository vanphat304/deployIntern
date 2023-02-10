import { Module } from '@nestjs/common';
import { NotficationController } from './notfication.controller';
import { NotficationService } from './notfication.service';

@Module({
  controllers: [NotficationController],
  providers: [NotficationService]
})
export class NotficationModule {}
