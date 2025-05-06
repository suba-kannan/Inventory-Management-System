import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@Entity()
export class Order {
  static delete(arg0: { productId: number; }) {
    throw new Error("Method not implemented.");
  }
  static findOne(arg0: { where: { id: number; }; relations: string[]; }) {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.orders, { eager: true })
  product: Product;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;


  @Column({ default: "pending" })
  status: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  totalPrice: number;
}
