import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Relation, BeforeInsert, BeforeUpdate} from "typeorm";
import {Order} from "./Order.js";
import bcrypt from "bcrypt";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id!:number;

  @Column({unique: true})
  email!:string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  password!: string;

  @Column({default: "user"})
  role!: string;

  @OneToMany(()=> Order, (order)=> order.user)
  orders!: Relation<Order>[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void>{
    if(!this.password.startsWith("$2b$"))
      this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}