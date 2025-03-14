import { ApiProperty } from '@nestjs/swagger';
import { PageResponse } from './shared/page.response';

class PatientBaseResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  chartNumber: number;
}

export class TotalResponse {
  @ApiProperty()
  total: number;
}

class PatientResponse extends PatientBaseResponse {
  @ApiProperty({ example: '01012345678', description: '"-"는 없습니다' })
  phoneNumber: string;

  @ApiProperty({ example: '000000-0******' })
  residentNumber: string;

  @ApiProperty({ type: 'string', nullable: true })
  address: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  memo: string | null;
}

export class PatientsResponse extends PageResponse {
  @ApiProperty({ type: [PatientResponse] })
  patients: PatientResponse[];
}
