import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { Repository } from "typeorm";

const productRepo: Repository<Product> = AppDataSource.getRepository(Product);
const orderRepo: Repository<Order> = AppDataSource.getRepository(Order);

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as Request & { user: { id: number } }).user.id;

    const product = await productRepo.findOneBy({ id: productId });

    if (!product) {
         res.status(404).json({ message: "Product not found" });
         return
    }
    if (product.stock < quantity){
       res.status(400).json({ message: "Not enough stock" });
       return
    }

    const totalAmount = product.price * quantity;

    const order = orderRepo.create({
      product,
      quantity,
      totalAmount,
      user: { id: userId }
    });

    await orderRepo.save(order);
    product.stock -= quantity;
    await productRepo.save(product);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: { id: number } }).user.id;

    const orders = await orderRepo.find({
      where: { user: { id: userId } },
      relations: ["product"],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as Request & { user: { id: number } }).user.id;
  
      const orders = await AppDataSource.getRepository(Order).find({
        where: { user: { id: userId } },
        relations: ['user', 'product'],
        order: { createdAt: 'DESC' },
      });
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user orders', error });
    }
  };
  
  export const getAllOrders = async (req: Request, res: Response) => {
    const user = (req as any).user;
  
    if (user.role !== "admin") {
       res.status(403).json({ message: "Access denied" });
       return
    }
  
    const orderRepo = AppDataSource.getRepository(Order);
    try {
      const orders = await orderRepo.find({
        relations: ["product", "user"],
        order: { createdAt: "DESC" }
      });
      const ordersWithTotal = orders.map(order => ({
        ...order,
        totalPrice: order.product.price * order.quantity,
      }));
  
      res.status(200).json(ordersWithTotal);
       return
    } catch (err) {
      console.error("Error fetching all orders:", err);
       res.status(500).json({ message: "Failed to fetch orders" });
       return
    }
  };
  

  // export const updateOrder = async (req: Request, res: Response) => {
  //   const orderId = parseInt(req.params.id);
  //   const { quantity } = req.body;
  //   const user = (req as any).user;
  
  //   if (user.role !== "admin") {
  //      res.status(403).json({ message: "Access denied" });
  //      return
  //   }
  
  //   if (!quantity || quantity <= 0) {
  //      res.status(400).json({ message: "Quantity must be a positive number" });
  //      return
  //   }
  
  //   const orderRepo = AppDataSource.getRepository(Order);
  //   const productRepo = AppDataSource.getRepository(Product);
  
  //   try {
  //     const order = await orderRepo.findOne({
  //       where: { id: orderId },
  //       relations: ["product"],
  //     });
  
  //     if (!order) {
  //        res.status(404).json({ message: "Order not found" });
  //        return
  //     }
  
  //     if (order.status === "cancelled") {
  //        res.status(400).json({ message: "Cannot edit a cancelled order" });
  //        return
  //     }
  
  //     const product = order.product;
  
  //     const stockDiff = quantity - order.quantity;
  //     if (stockDiff > 0 && product.stock < stockDiff) {
  //        res.status(400).json({ message: "Not enough stock available" });
  //        return
  //     }
  
  //     product.stock -= stockDiff;
  //     await productRepo.save(product);
  
  //     order.quantity = quantity;
  //     order.totalPrice = quantity * product.price;
  
  //     await orderRepo.save(order);
  
  //      res.json(order);
  //      return
  //   } catch (err) {
  //     console.error("Update order error:", err);
  //      res.status(500).json({ message: "Server error" });
  //      return
  //   }
  // };
  
  // export const cancelOrder = async (req: Request, res: Response) => {
  //   try {
  //     const orderId = parseInt(req.params.id);
  //     const userId = (req as Request & { user: { id: number } }).user.id;
  
  //     const order = await orderRepo.findOne({
  //       where: { id: orderId },
  //       relations: ["product", "user"],
  //     });
  
  //     if (!order) {
  //        res.status(404).json({ message: "Order not found" });
  //        return
  //     }
  
  //     if (order.user.id !== userId && (req as any).user.role !== "admin") {      
  //          res.status(403).json({ message: "Unauthorized" });
  //          return
  //     }
  
  //     order.product.stock += order.quantity;
  //     await productRepo.save(order.product);
  //     await orderRepo.remove(order);
  
  //      res.status(200).json({ message: "Order cancelled" });
  //      return
  //   } catch (error) {
  //      res.status(500).json({ message: "Cancel error", error });
  //      return
  //   }
  // };
  export const cancelOrder = async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = (req as Request & { user: { id: number; role: string } }).user.id;
      const userRole = (req as Request & { user: { role: string } }).user.role;
  
      const order = await orderRepo.findOne({
        where: { id: orderId },
        relations: ["product", "user"],
      });
  
      if (!order) {
         res.status(404).json({ message: "Order not found" });
         return
      }
  
      if (order.user.id !== userId && userRole !== "admin") {
         res.status(403).json({ message: "Unauthorized" });
         return
      }
  
      if (order.status === "cancelled") {
         res.status(400).json({ message: "Order already cancelled" });
         return
      }
  
      // Restore stock
      order.product.stock += order.quantity;
      await productRepo.save(order.product);
  
      // Just update the status instead of deleting
      order.status = "cancelled";
      await orderRepo.save(order);
  
       res.status(200).json({ message: "Order cancelled successfully", order });
       return
    } catch (error) {
       res.status(500).json({ message: "Cancel error", error });
       return
    }
  };
  

  
// Update order status (admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOneBy({ id: parseInt(id) });

    if (!order) {
       res.status(404).json({ message: "Order not found" });
       return
    }

    order.status = status;
    await orderRepo.save(order);

    res.json({ message: "Order status updated", status });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};