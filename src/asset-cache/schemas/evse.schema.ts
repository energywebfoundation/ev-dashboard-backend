import { IConnector, IGeoLocation, IImage } from '@energyweb/ocn-bridge';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Evse {
  @PrimaryGeneratedColumn()
  _id: string;

  @Column()
  uid: string;

  @Column() // can be nullable if REMOVED but we don't care about those
  evse_id: string;

  @Column()
  status: string;

  @Column({ type: 'json', nullable: true })
  status_schedule: {
    period_begin: Date;
    period_end: Date;
    status: string;
  };

  @Column({ type: 'json', nullable: true })
  capabilities: string[];

  @Column({ type: 'json' })
  connectors: IConnector[];

  @Column({ nullable: true })
  floor_level: string;

  @Column({ type: 'json', nullable: true })
  coordinates: IGeoLocation;

  @Column({ type: 'json', nullable: true })
  images: IImage[];

  @Column({ type: 'timestamptz' })
  last_updated: Date;
}
