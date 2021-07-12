import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PartnerType } from '../types';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  countryCode: string;

  @Column()
  partyId: string;

  @Column({
    type: 'enum',
    enum: PartnerType,
  })
  type: PartnerType;

  @Column({ nullable: true })
  apiToken: string;
}
