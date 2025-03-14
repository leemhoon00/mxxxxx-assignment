import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class PatientService {
  create(file: Express.Multer.File) {
    const excel = XLSX.read(file.buffer, { type: 'buffer' });

    const sheet = excel.Sheets[excel.SheetNames[0]];

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

    const notChartNumberPatients: Record<
      string,
      { residentNumber: string; address: string | null; memo: string | null }
    > = {};
    const chartNumberPatients: Record<
      string,
      { residentNumber: string; address: string | null; memo: string | null }
    > = {};

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

      if (patient.residentNumber.length === 6)
        residentNumber = `${patient.residentNumber}-0******`;
      else if (patient.residentNumber.length === 13)
        residentNumber = `${patient.residentNumber.slice(0, 7)}-${patient.residentNumber.slice(7, 8)}******`;
      else residentNumber = `${patient.residentNumber.slice(0, 8)}******`;

      if (patient.chartNumber === null) {
        const key = `${patient.name}_${phoneNumber}`;
        notChartNumberPatients[key] = {
          residentNumber,
          address: patient.address,
          memo: patient.memo,
        };
      } else {
        if (notChartNumberPatients[`${patient.name}_${phoneNumber}`]) {
          delete notChartNumberPatients[`${patient.name}_${phoneNumber}`];
        }
        const key = `${patient.name}_${phoneNumber}_${patient.chartNumber}`;
        chartNumberPatients[key] = {
          residentNumber,
          address: patient.address,
          memo: patient.memo,
        };
      }
    }
  }
}
