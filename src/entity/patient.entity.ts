import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['phoneNumber', 'chartNumber', 'name'])
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chartNumber: number;

  @Column({ length: 16 })
  name: string;

  @Column({ length: 11 })
  phoneNumber: string;

  @Column({ length: 15 })
  residentNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  memo: string | null;
}
