import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['chartNumber', 'name', 'phoneNumber'])
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chartNumber: number;

  @Column({ length: 16 })
  name: string;

  @Column()
  phoneNumber: string;

  @Column({ length: 15 })
  residentNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  memo: string | null;
}
