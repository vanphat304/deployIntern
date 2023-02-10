import {
  Global,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';
import { writeFile } from 'fs/promises';
import { Response } from 'express';

@Injectable()
export class ImportExportService {
  async exportExcel(res: Response, data: Array<any>, fileName = 'fileExcel') {
    res.setHeader('Content-disposition', `attachment; filename=${fileName}.xlsx`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    if (!data || data.length === 0) {
      throw new HttpException('no data to download', HttpStatus.BAD_REQUEST, {
        cause: {
          message: 'no not emtpy',
          name: 'error',
        },
      });
    }

    let rows = [];

    data.forEach((doc) => rows.push(Object.values(doc)));

    let book = new Workbook();

    let sheet = book.addWorksheet('sheet1');

    sheet.columns =
      data[0] &&
      Object.keys(data[0]).map((item) => {
        return {
          header: item.toString().toUpperCase(),
          key: item,
          width: 20,
          hidden: item === 'jobId',
          font: {
            bold: true,
            color: {
              argb: '#333',
            },
          },
        };
      });

    sheet.addRows(rows);

    return book.xlsx.write(res);
  }

  async readFile(file) {
    const workbook = new Workbook();
    let dataExtractFromFile = [];
    const content = await workbook.xlsx.load(file.buffer);
    content.eachSheet((sheet, id) => {

      sheet.eachRow((row, rowIndex) => {
        dataExtractFromFile.push({
          id: row.values[1],
          subId: row.values[2],
          value: row.values[3],
          description: row.values[4],
        });
      });
    });
    return dataExtractFromFile;
  }
}
