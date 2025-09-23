import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Order} from "./Order";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id!:number;

  @Column({unique: true})
  email!:string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({default: "user"})
  role!: string;

  @OneToMany(()=> Order, (order)=> order.user)
  orders!: Order[];

  @Column({type: "timestamp", default: ()=>"CURRENT_TIMESTAMP"})
  createdAt!: Date;
}