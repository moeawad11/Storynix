import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  title!: string;

  @Index()
  @Column()
  author!: string;

  @Column({ unique: true })
  isbn!: string;

  @Column({ default: "No description provided." })
  description!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  price!: number;

  @Column({ default: 0 })
  stockQuantity!: number;

  @Column("text", { array: true, default: "{}" })
  images!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
