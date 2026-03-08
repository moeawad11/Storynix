import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
  BeforeInsert,
} from "typeorm";
import { Order } from "./Order.js";
import bcrypt from "bcrypt";
import { Cart } from "./Cart.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: "user" })
  role!: "user" | "admin";

  @OneToMany(() => Order, (order) => order.user)
  orders!: Relation<Order>[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Relation<Cart>[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const rounds = process.env.NODE_ENV === "test" ? 1 : 12;
    this.password = await bcrypt.hash(this.password, rounds);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
