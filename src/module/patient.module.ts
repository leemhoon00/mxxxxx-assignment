import { Module } from '@nestjs/common';
import { PatientController } from '../presentation/controller/patient.controller';
import { PatientService } from '../provider/patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from 'src/entity/patient.entity';
import { PatientRepository } from 'src/repository/patient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity])],
  controllers: [PatientController],
  providers: [PatientService, PatientRepository],
})
export class PatientModule {}
