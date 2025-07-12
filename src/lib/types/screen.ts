import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";


/** REACT APP STATE **/
export interface AppRootState {
productsPage: ProductsPageState;
//productsPage: ProductsPageState;
ordersPage: OrdersPageState;
}

/** PRODUCTS PAGE **/
export interface ProductsPageState {
    restaurant: Member | null;
    chosenProduct: Product | null;
    products: Product[];
}

/** ORDERS PAGE **/
export interface OrdersPageState{
    pausedOrders: Order[]
    processOrders: Order[]
    finishedOrders:Order[]
}