import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class Order{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(()=> User, (user)=> user.orders)
  @JoinColumn({name: "userId"})
  user!:User;

  @Column("jsonb")
  orderItems!: { productId: number; quantity: number; price: number }[];

  @Column()
  shippingAddress!: string;

  @Column()
  paymentMethod!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ default: false })
  isPaid!: boolean;

  @Column({ nullable: true })
  paidAt!: Date;
  
  @Column({ default: "Processing" })
  orderStatus!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}