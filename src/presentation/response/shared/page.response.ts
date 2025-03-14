import { ApiProperty } from '@nestjs/swagger';

export class PageResponse {
  @ApiProperty()
  totalCount: number;
}
