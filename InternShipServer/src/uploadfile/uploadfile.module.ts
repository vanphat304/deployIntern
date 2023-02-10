import { Module } from '@nestjs/common';
import { UploadfileController } from './uploadfile.controller';

@Module({
  controllers: [UploadfileController],
})
export class UploadfileModule {}
