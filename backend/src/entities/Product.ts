import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Product {
  static remove(product: never) {
    throw new Error("Method not implemented.");
  }
  static findOne(arg0: { where: { id: number; }; }) {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  supplier: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}
