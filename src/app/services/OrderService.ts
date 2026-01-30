import axios from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../../lib/types/search";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";

class OrderService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }

    public async createOrder(input: CartItem[]): Promise<Order>{
     try{
     const orderItems: OrderItemInput[] = input.map((cartItem: CartItem)=>{
     if (process.env.NODE_ENV === 'development') {
       console.log("Processing cartItem:", cartItem);
       console.log("cartItem._id:", cartItem._id);
       console.log("cartItem._id type:", typeof cartItem._id);
       console.log("cartItem._id length:", cartItem._id?.length);
     }
     
     return {
        itemQuantity: cartItem.quantity,
        itemPrice: cartItem.price,
        productId: cartItem._id
     }
     });

     const url = `${this.path}order/create`;
     
     // Debug logging (only in development)
     if (process.env.NODE_ENV === 'development') {
       console.log("=== ORDER SERVICE DEBUG ===");
       console.log("URL:", url);
       console.log("Input cartItems:", input);
       console.log("Transformed orderItems:", orderItems);
       console.log("orderItems type:", typeof orderItems);
       console.log("orderItems isArray:", Array.isArray(orderItems));
       console.log("orderItems length:", orderItems.length);
     }
     
     // Get member data from localStorage
     const memberData = localStorage.getItem("memberData");
     if (!memberData) {
       throw new Error("No member data found. Please login again.");
     }
     
     const member = JSON.parse(memberData);
     if (process.env.NODE_ENV === 'development') {
       console.log("Member data:", member);
     }
     
     // Check cookies before request (only in development)
     if (process.env.NODE_ENV === 'development') {
       console.log("=== COOKIE DEBUG ===");
       console.log("All cookies:", document.cookie);
       console.log("withCredentials:", true);
       console.log("axios.defaults.withCredentials:", axios.defaults.withCredentials);
       console.log("Request URL:", url);
       console.log("Current origin:", window.location.origin);
       console.log("⚠️ DEVELOPMENT MODE: Ensure backend sets cookies with:");
       console.log("  - domain: 'localhost' (without port)");
       console.log("  - sameSite: 'lax' or 'none'");
       console.log("  - path: '/'");
       console.log("  - CORS: Access-Control-Allow-Credentials: true");
     }
     
     // Send just the orderItems array as the backend expects input to be an array
     const payload = orderItems;
     
     if (process.env.NODE_ENV === 'development') {
       console.log("Final payload (orderItems array):", payload);
       console.log("Payload JSON:", JSON.stringify(payload, null, 2));
       console.log("Payload type:", typeof payload);
       console.log("Payload isArray:", Array.isArray(payload));
       console.log("Each orderItem structure:", payload.map((item, index) => ({
         index,
         itemQuantity: item.itemQuantity,
         itemPrice: item.itemPrice,
         productId: item.productId,
         productIdType: typeof item.productId,
         productIdLength: item.productId?.length
       })));
     }
     
     const result = await axios.post(url, payload, {
       withCredentials: true,
       headers: {
         'Content-Type': 'application/json',
       }
     })
     
     if (process.env.NODE_ENV === 'development') {
       console.log("createdOrder:", result)
       console.log("createdOrder data:", result.data)
       console.log("createdOrder status:", result.data?.orderStatus)
       console.log("createdOrder memberId:", result.data?.memberId)
       console.log("createdOrder _id:", result.data?._id)
     }

     return result.data
     }catch(err){
        // Always log errors, even in production
        console.error("Error.createOrder:", err)
        if (process.env.NODE_ENV === 'development') {
          console.log("Error response data:", err.response?.data);
          console.log("Error response status:", err.response?.status);
          console.log("Error response headers:", err.response?.headers);
          console.log("Full error response:", JSON.stringify(err.response?.data, null, 2));
        }
        throw err;
     }
    }


    public async getMyOrders(input: OrderInquiry): Promise<Order[]>{
        try{
          //axios.defaults.withCredentials = true;
          const url = `${this.path}order/all`;
          let query = `?page=${input.page}&limit=${input.limit}`;
          
          // Only add orderStatus to query if it's defined
          if (input.orderStatus) {
            query += `&orderStatus=${input.orderStatus}`;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log("getMyOrders URL:", url + query);
            console.log("getMyOrders withCredentials:", true);
          }
          
          // Get member data from localStorage to verify user
          const memberData = localStorage.getItem("memberData");
          if (memberData && process.env.NODE_ENV === 'development') {
            const member = JSON.parse(memberData);
            console.log("Current member data:", member);
          }

          const result = await axios.get(url+query, {withCredentials:true})
          
          if (process.env.NODE_ENV === 'development') {
            console.log("getMyOrders:", result)
            console.log("getMyOrders response data:", result.data)
            console.log("getMyOrders response status:", result.status)
            console.log("getMyOrders response headers:", result.headers)
          }

          return result.data;
      
        }catch(err){
           console.error("Error.getMyOrders:", err)
           if (process.env.NODE_ENV === 'development') {
             console.log("Error response:", err.response?.data);
             console.log("Error status:", err.response?.status);
           }
           throw err;
        }
       }



       public async updateOrder(input: OrderUpdateInput): Promise<Order>{
        try{
       
      const url = `${this.path}order/update`
      const result = await axios.post(url, input, {withCredentials: true})
      
      if (process.env.NODE_ENV === 'development') {
        console.log("updateOrder:", result)
      }

      return result.data
        }catch(err){
           console.error("Error.updateOrder:", err)
           throw err;
        }
       }
}

export default OrderService;