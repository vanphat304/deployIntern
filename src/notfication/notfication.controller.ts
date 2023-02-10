import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { NotficationService } from './notfication.service';
import { NotificationStudent } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('/notification')
export class NotficationController {
  constructor(private notificationService: NotficationService) {}

  @Get(':id')
  getListNotificationById(@Param('id') id: string): Promise<Array<NotificationStudent>> {
    return this.notificationService.getListNotificationByIdStudent(id);
  }

  @Get()
  getListNotifications(): Promise<Array<NotificationStudent>> {
    return this.notificationService.getListNotifications()
  }

  @Put('update')
  @UseGuards(AuthGuard('jwtGuard'))
  updateStudent(@Body() dto: Pick<NotificationStudent, 'id'>) {
    const { id } = dto;
    return this.notificationService.updateNotificationById(id);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwtGuard'))
  deleteStudent(@Param('id') id: string) {
    return this.notificationService.deleteNotificationById(id);
  }
}
