import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn} from "typeorm";

@Entity()
export class Book{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column({unique: true})
  isbn!: string;

  @Column({default: "No description yet."})
  description!: string;

  @Column({type: "decimal", precision: 10, scale: 2, default: 0.00})
  price!: number;

  @Column({default:0})
  stockQuantity!: number;

  @Column("text", {array: true, default:"{}"})
  images!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}