import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { PrismaService } from './prisma.service';

// Global Module so you do not need to export and import in every other module - it will be availabvle
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule { }
