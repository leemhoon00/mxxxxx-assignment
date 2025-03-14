import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { CreatePatientInput } from 'src/repository/patient.repository';
import { PatientRepository } from 'src/repository/patient.repository';

@Injectable()
export class PatientService {
  constructor(private patientRepository: PatientRepository) {}
  async create(file: Express.Multer.File) {
    const excel = XLSX.read(file.buffer, { type: 'buffer' });

    const sheet = excel.Sheets[excel.SheetNames[0]];

    // 파싱했을 때 property가 한글로 받아와지는 문제가 발생해 header를 재정의했습니다.
    const headerMapping = [
      'chartNumber',
      'name',
      'phoneNumber',
      'residentNumber',
      'address',
      'memo',
    ];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: headerMapping,
      defval: null,
    }) as {
      chartNumber: string | null;
      name: string | null;
      phoneNumber: string | number;
      residentNumber: string;
      address: string | null;
      memo: string | null;
    }[];

    // 시간복잡도 O(1)을 위한 자료구조입니다.
    const notChartNumberPatients: Record<string, CreatePatientInput> = {};
    const chartNumberPatients: Record<string, CreatePatientInput> = {};

    // header를 재정의했기에 첫 데이터는 한글 헤더가 받아와지는데 해당 데이터는 버립니다.
    for (let i = 1; i < rows.length; i++) {
      const patient = rows[i];

      if (
        patient.name === null ||
        patient.name.length < 1 ||
        patient.name.length > 16
      )
        continue;

      const phoneNumber = String(patient.phoneNumber).replaceAll('-', '');
      let residentNumber: string;

      // 주민등록번호 변환
      if (patient.residentNumber.length === 6)
        residentNumber = `${patient.residentNumber}-0******`;
      else if (patient.residentNumber.length === 13)
        residentNumber = `${patient.residentNumber.slice(0, 7)}-${patient.residentNumber.slice(7, 8)}******`;
      else residentNumber = `${patient.residentNumber.slice(0, 8)}******`;

      if (patient.chartNumber === null) {
        // 차트번호가 없는 데이터는 (이름_전화번호)를 키로 사용하여 데이터를 저장합니다.
        // 이미 (이름_전화번호_차트번호)에 해당하는 데이터가 있다하더라도 요구사항에는 별도의 언급이 없어 데이터를 저장하고 있습니다.
        const key = `${patient.name}_${phoneNumber}`;
        notChartNumberPatients[key] = {
          name: patient.name,
          phoneNumber: String(patient.phoneNumber),
          chartNumber: 0,
          residentNumber,
          address: patient.address,
          memo: patient.memo,
        };
      } else {
        // 차트번호가 있는 데이터를 처리하기 전에 먼저 (이름_전화번호)를 key 값으로 가진 데이터가 있다면 삭제합니다.
        // 저장시점뿐만 아니라 엑셀 파일내에서도 아래에 있는 데이터가 더 최신의 데이터라고 가정하여 이렇게 구현하였습니다.
        if (notChartNumberPatients[`${patient.name}_${phoneNumber}`]) {
          delete notChartNumberPatients[`${patient.name}_${phoneNumber}`];
        }

        // 차트번호가 있는 데이터는 (이름_전화번호_차트번호)를 key 로 설정해 데이터를 저장합니다.
        // 이렇게 메모리 레벨에서 먼저 데이터를 처리하는 이유는 데이터베이스로 가는 데이터수를 최대한 줄이기 위함입니다.
        const key = `${patient.name}_${phoneNumber}_${patient.chartNumber}`;
        chartNumberPatients[key] = {
          name: patient.name,
          phoneNumber: String(patient.phoneNumber),
          chartNumber: Number(patient.chartNumber),
          residentNumber,
          address: patient.address,
          memo: patient.memo,
        };
      }
    }

    // 차트번호가 있는 데이터를 저장할 땐 차트번호가 없는 데이터를 삭제하는 로직이 포함되어 있기 때문에 먼저 저장해야합니다.
    // 엑셀 파일상으로 (이름_전화번호) 데이터 이후에 (이름_전화번호_차트번호)의 데이터가 들어온다면 기존 데이터를 삭제해야하지만 (이름_전화번호_차트번호) 이후에 (이름_전화번호) 데이터가 있다면 두 데이터 모두 저장해야하기 때문입니다.
    await this.patientRepository.upsertManyWithChartNumber([
      ...Object.values(chartNumberPatients),
    ]);

    // 차트번호가 있는 데이터가 저장에 성공하고 아래 데이터가 저장에 실패한다 하더라도 큰 문제는 없을것같아 트랜잭션으로 묶지는 않았습니다.
    await this.patientRepository.upsertManyWithoutChartNumber([
      ...Object.values(notChartNumberPatients),
    ]);

    return (
      Object.keys(chartNumberPatients).length +
      Object.keys(notChartNumberPatients).length
    );
  }
}
