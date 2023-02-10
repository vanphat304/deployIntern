import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('uploadfile')
export class UploadfileController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadFile/fileInfoStudent',
        filename: (req, file, cb) => {
          const fileName: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + new Date().getTime();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          // new FileTypeValidator({ fileType: '^.*.(doc|DOC|pdf|PDF)$' }),
        ],
      }),
    )
    file,
  ) {
    return file;
  }

  @Get(':imageName')
  getFileUpload(@Param('imageName') imageName: string, @Res() res) {
    return res.sendFile(join(process.cwd(), 'uploadFile/fileInfoStudent/' + imageName));
  }
}
