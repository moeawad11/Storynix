import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import { User } from "./User.js";

interface OrderItem {
  bookId: number;
  title: string;
  quantity: number;
  price: number;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;

  @Column("jsonb")
  orderItems!: OrderItem[];

  @Column()
  shippingAddress!: string;

  @Column()
  paymentMethod!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: "varchar", nullable: true })
  paymentIntentId!: string | null;

  @Column({ default: false })
  isPaid!: boolean;

  @Column({ type: "timestamp", nullable: true })
  paidAt!: Date | null;

  @Column({ default: "Processing" })
  orderStatus!: string;

  @Column({ default: false })
  isDelivered!: boolean;

  @Column({ type: "timestamp", nullable: true })
  deliveredAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
