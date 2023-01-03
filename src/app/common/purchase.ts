import { BillingAddress } from "./billing-address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";
import { ShippingAddress } from "./shipping-address";

export class Purchase {

    constructor(public customer: Customer, 
         public shippingAddress: ShippingAddress,
         public billingAddress: BillingAddress, 
         public order: Order, 
         public orderItems: OrderItem[]) {

    }
}
