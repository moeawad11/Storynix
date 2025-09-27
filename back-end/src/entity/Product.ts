import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn} from "typeorm";

@Entity()
export class Product{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({default: "No description yet."})
  description!: string;

  @Column({type: "decimal", precision: 10, scale: 2, default: 0.00})
  price!: number;

  @Column()
  stockQuantity!: number;

  @Column("simple-array")
  images!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}