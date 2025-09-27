import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Relation} from "typeorm";
import { User } from "./User.js";

@Entity()
export class Order{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(()=> User, (user)=> user.orders)
  @JoinColumn({name: "userId"})
  user!:Relation<User>;

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  calculateTotal(): number {
    return this.orderItems.reduce((sum,item)=> sum+ item.price*item.quantity,0);
  }
  
}