import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  uid: string;

  @Column()
  brandName: string;

  @Column()
  modelName: string;

  @Column()
  chargePortType: string;

  @Column()
  chargePortPower: number;

  @Column({ nullable: true })
  fastChargePortType: string;

  @Column({ nullable: true })
  fastChargePortPower: number;

  @Column()
  batteryCapacity: number;
}
