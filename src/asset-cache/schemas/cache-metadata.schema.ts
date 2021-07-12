import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CacheMetadata {
  @PrimaryColumn()
  _id: number;

  @Column({ type: 'timestamptz' })
  lastUpdated: Date;
}
