import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientService } from '../../provider/patient.service';
import { CreatePatientsRequest } from '../request/patient.request';

@ApiTags('/patients')
@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @ApiOperation({ summary: '엑셀파일등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePatientsRequest })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    this.patientService.create(file);
  }
}
