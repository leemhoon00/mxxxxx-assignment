import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
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
import { PageRequest } from '../request/shared/page.request';
import { PatientsResponse } from '../response/patient.response';

@ApiTags('/patients')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
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
    const total = await this.patientService.create(file);

    return { total };
  }

  @ApiOperation({ summary: '환자 리스트 조회' })
  @ApiResponse({ status: 200, type: PatientsResponse })
  @Get()
  async getMany(
    @Query() { page, size }: PageRequest,
  ): Promise<PatientsResponse> {
    return await this.patientService.getManyByPage({
      page: page ?? 1,
      size: size ?? 10,
    });
  }
}
