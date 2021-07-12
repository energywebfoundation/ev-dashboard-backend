import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AssetMetadata {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  uid: string;

  @Column()
  did: string;

  @Column()
  operatorDid: string;

  @Column({ nullable: true })
  serviceEndpoint: string;
}
