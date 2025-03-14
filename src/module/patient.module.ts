import { Module } from '@nestjs/common';
import { PatientController } from '../presentation/controller/patient.controller';
import { PatientService } from '../provider/patient.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
