import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";
import { Member } from "../../lib/types/member";


export interface ProductInput {
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize: string;
    productVolume: number;
    productDesc?: string;
    productImages: string[];
    productCollection: string;
    productStatus?: string;
}

class ProductService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }
    
    public async getProducts(input: ProductInquiry):Promise<Product[]>{
        try{
            // Ensure page and limit are valid numbers
            const page = Number(input.page) || 1;
            const limit = Number(input.limit) || 20;
            
            let url = `${this.path}product/all?order=${input.order}&page=${page}&limit=${limit}`;

            if(input.productCollection) url += `&productCollection=${input.productCollection}`;
            if(input.search) url += `&search=${input.search}`;

            const result = await axios.get(url);
            return result.data;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, getProducts:", err);
            }
            throw err;
        }
    }
    
    public async getProduct(productId: string): Promise<Product>{
        try{
            const url = `${this.path}product/${productId}`;
            const result = await axios.get(url);
            return result.data;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, getProduct:", err);
            }
            throw err;
        }
    }

    // Create new product
    public async createProduct(input: ProductInput): Promise<Product>{
        try{
            const url = `${this.path}product/create`;
            const result = await axios.post(url, input, {withCredentials: true});
            return result.data;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, createProduct:", err);
            }
            throw err;
        }
    }

    // Update existing product
    public async updateProduct(productId: string, input: Partial<ProductInput>): Promise<Product>{
        try{
            const url = `${this.path}product/${productId}`;
            const result = await axios.put(url, input, {withCredentials: true});
            return result.data;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, updateProduct:", err);
            }
            throw err;
        }
    }

    // Delete product
    public async deleteProduct(productId: string): Promise<void>{
        try{
            const url = `${this.path}product/${productId}`;
            await axios.delete(url, {withCredentials: true});
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, deleteProduct:", err);
            }
            throw err;
        }
    }

    // Upload product image
    public async uploadProductImage(file: File): Promise<string>{
        try{
            const url = `${this.path}product/upload-image`;
            const formData = new FormData();
            formData.append('image', file);
            
            const result = await axios.post(url, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return result.data.imageUrl;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, uploadProductImage:", err);
            }
            throw err;
        }
    }

    // Get products by collection
    public async getProductsByCollection(collection: string, limit: number = 10): Promise<Product[]>{
        try{
            const url = `${this.path}product/collection/${collection}?limit=${limit}`;
            const result = await axios.get(url);
            return result.data;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, getProductsByCollection:", err);
            }
            throw err;
        }
    }

    // Search products
    public async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]>{
        try{
            const url = `${this.path}product/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`;
            const result = await axios.get(url);
            return result.data;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, searchProducts:", err);
            }
            throw err;
        }
    }
    
    // Increment product views
    public async incrementProductViews(productId: string): Promise<void> {
        try {
            const url = `${this.path}product/${productId}/view`;
            await axios.post(url);
        } catch (err) {
            // Don't throw error - views are not critical functionality
            if (process.env.NODE_ENV === 'development') {
                console.error("Error incrementing product views:", err);
            }
        }
    }
}

export default ProductService