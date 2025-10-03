import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import { User } from "./User.js";
import { Book } from "./Book.js";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;

  @ManyToOne(() => Book, { eager: true })
  @JoinColumn({ name: "bookId" })
  book!: Relation<Book>;

  @Column()
  quantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
