import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientService } from '../../provider/patient.service';
import { CreatePatientsRequest } from '../request/patient.request';
import { TotalResponse } from '../response/patient.response';

@ApiTags('/patients')
@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @ApiOperation({ summary: '엑셀파일등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePatientsRequest })
  @ApiResponse({ status: 201, type: TotalResponse })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TotalResponse> {
    console.time('time');

    const total = await this.patientService.create(file);

    console.timeEnd('time');

    return { total };
  }
}
