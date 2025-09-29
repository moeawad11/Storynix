import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Relation} from "typeorm";
import { User } from "./User.js";

interface OrderItem {
  bookId: number; 
  title: string; 
  quantity: number; 
  price: number;
}

@Entity()
export class Order{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(()=> User, (user)=> user.orders)
  @JoinColumn({name: "userId"})
  user!:Relation<User>;

  @Column("jsonb")
  orderItems!: OrderItem[];

  @Column()
  shippingAddress!: string;

  @Column()
  paymentMethod!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({nullable: true})
  paymentIntentId!: string;

  @Column({ default: false })
  isPaid!: boolean;

  @Column({ nullable: true })
  paidAt!: Date;
  
  @Column({ default: "Processing" })
  orderStatus!: string;

  @Column({default: false})
  isDelivered!: boolean;

  @Column({nullable: true})
  deliveredAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}