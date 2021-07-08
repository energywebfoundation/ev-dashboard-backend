import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryColumn({ default: 0 })
  id: number; // only one auth object should ever be persisted

  @Column()
  tokenB: string;

  @Column()
  tokenC: string;
}
