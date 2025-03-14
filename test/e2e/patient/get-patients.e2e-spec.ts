import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatientEntity } from 'src/entity/patient.entity';
import { Repository } from 'typeorm';

describe('GET /patients - 환자 리스트 조회', () => {
  let app: INestApplication;
  let patientRepo: Repository<PatientEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    patientRepo = module.get<Repository<PatientEntity>>(
      getRepositoryToken(PatientEntity),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await patientRepo.clear();
  });

  it('page가 1보다 작거나 숫자가 아닐때 400을 반환한다', async () => {
    // when
    const response1 = await request(app.getHttpServer())
      .get('/patients')
      .query({
        page: 0,
      });

    const response2 = await request(app.getHttpServer())
      .get('/patients')
      .query({
        page: 'INVALID',
      });

    // then
    expect(response1.status).toBe(400);
    expect(response2.status).toBe(400);
  });

  it('size가 1보다 작거나 숫자가 아닐때 400을 반환한다', async () => {
    // when
    const response1 = await request(app.getHttpServer())
      .get('/patients')
      .query({
        size: 0,
      });

    const response2 = await request(app.getHttpServer())
      .get('/patients')
      .query({
        size: 'INVALID',
      });

    // then
    expect(response1.status).toBe(400);
    expect(response2.status).toBe(400);
  });
});
