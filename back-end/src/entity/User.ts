import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
  BeforeInsert,
  BeforeUpdate,
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

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Relation<Order>[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Relation<Cart>[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const bcryptRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
    if (!bcryptRegex.test(this.password))
      this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
