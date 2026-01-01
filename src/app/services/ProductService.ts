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
        console.log("🔧 ProductService initialized with path:", this.path);
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
            console.log("getProducts:", result);

            return result.data;
        }catch(err){
            console.log("Error, getProducts:", err)
            throw err;
        }
    }
    
    public async getProduct(productId: string): Promise<Product>{
        try{
            const url = `${this.path}product/${productId}`;
            console.log(" Fetching product from URL:", url);
            const result = await axios.get(url);
            console.log(" getProduct result:", result.data);
            return result.data;
        }catch(err){
            console.log(" Error, getProduct:", err);
            console.log(" Error response:", err.response?.data);
            console.log(" Error status:", err.response?.status);
            throw err;
        }
    }

    // Create new product
    public async createProduct(input: ProductInput): Promise<Product>{
        try{
            const url = `${this.path}product/create`;
            console.log("Creating product with URL:", url);
            console.log("Product input:", input);
            
            const result = await axios.post(url, input, {withCredentials: true});
            console.log("Product created successfully:", result.data);
            return result.data;
        }catch(err){
            console.log("Error, createProduct:", err);
            console.log("Error response:", err.response?.data);
            throw err;
        }
    }

    // Update existing product
    public async updateProduct(productId: string, input: Partial<ProductInput>): Promise<Product>{
        try{
            const url = `${this.path}product/${productId}`;
            console.log("Updating product with URL:", url);
            console.log("Update input:", input);
            
            const result = await axios.put(url, input, {withCredentials: true});
            console.log("Product updated successfully:", result.data);
            return result.data;
        }catch(err){
            console.log("Error, updateProduct:", err);
            console.log("Error response:", err.response?.data);
            throw err;
        }
    }

    // Delete product
    public async deleteProduct(productId: string): Promise<void>{
        try{
            const url = `${this.path}product/${productId}`;
            console.log("Deleting product with URL:", url);
            
            const result = await axios.delete(url, {withCredentials: true});
            console.log("Product deleted successfully:", result.data);
        }catch(err){
            console.log("Error, deleteProduct:", err);
            console.log("Error response:", err.response?.data);
            throw err;
        }
    }

    // Upload product image
    public async uploadProductImage(file: File): Promise<string>{
        try{
            const url = `${this.path}product/upload-image`;
            console.log("Uploading image with URL:", url);
            
            const formData = new FormData();
            formData.append('image', file);
            
            const result = await axios.post(url, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Image uploaded successfully:", result.data);
            return result.data.imageUrl;
        }catch(err){
            console.log("Error, uploadProductImage:", err);
            console.log("Error response:", err.response?.data);
            throw err;
        }
    }

    // Get products by collection
    public async getProductsByCollection(collection: string, limit: number = 10): Promise<Product[]>{
        try{
            const url = `${this.path}product/collection/${collection}?limit=${limit}`;
            const result = await axios.get(url);
            console.log(`Products for collection ${collection}:`, result.data);
            return result.data;
        }catch(err){
            console.log("Error, getProductsByCollection:", err);
            throw err;
        }
    }

    // Search products
    public async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]>{
        try{
            const url = `${this.path}product/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`;
            const result = await axios.get(url);
            console.log(`Search results for "${searchTerm}":`, result.data);
            return result.data;
        }catch(err){
            console.log("Error, searchProducts:", err);
            throw err;
        }
    }
    
    // Increment product views
    public async incrementProductViews(productId: string): Promise<void> {
        try {
            const url = `${this.path}product/${productId}/view`;
            await axios.post(url);
            console.log(`Incremented views for product: ${productId}`);
        } catch (err) {
            console.log("Error incrementing product views:", err);
            // Don't throw error - views are not critical functionality
        }
    }
}

export default ProductService