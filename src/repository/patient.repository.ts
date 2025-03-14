import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from 'src/entity/patient.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepo: Repository<PatientEntity>,
  ) {}

  // 차트번호가 없는 데이터
  async upsertManyWithoutChartNumber(inputs: CreatePatientInput[]) {
    await this.patientRepo.upsert(inputs, [
      'name',
      'phoneNumber',
      'chartNumber',
    ]);
  }

  // 차트번호가 있는 데이터
  async upsertManyWithChartNumber(inputs: CreatePatientInput[]) {
    await this.patientRepo.manager.transaction(
      async (manager: EntityManager) => {
        await manager.upsert(PatientEntity, inputs, [
          'name',
          'phoneNumber',
          'chartNumber',
        ]);
        await manager.delete(
          PatientEntity,
          inputs.map(({ name, phoneNumber }) => ({
            name,
            phoneNumber,
            chartNumber: 0,
          })),
        );
      },
    );
  }

  async findManyByPage({ page, size }: { page: number; size: number }) {
    return await this.patientRepo.find({
      skip: (page - 1) * size,
      take: size,
      order: {
        id: 'ASC',
      },
    });
  }

  async countAll() {
    return await this.patientRepo.count();
  }
}

export type CreatePatientInput = Omit<PatientEntity, 'id'>;
