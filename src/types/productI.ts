import User from "./UserI"

export type image = {
    public_id : string
    url:string
  }
  export type reviews = {
    _id:string
    user:User
    name : string
    rating:number
    comment:string
  }
  enum Category  {
    electronics = "electronics",
    food = "food",
    camera = "camera",
    laptops = "laptops",
    mobiles = "mobiles",
    headphones = "headphones",
    accessories = "accessories",
    sports = "sports",
    outdoor = "outdoor",
  }
  
  export default interface IProduct  {
    _id:string
    name: string;
    description: string;
    price: number;
    stock:number;
    numOfReviews : number;
    ratings:number;
    images : image[];
    category : Category;
    seller:string;
    reviews : reviews[]
    cretedAt:string
    
  }
  export interface AllProductResponse{
    success: true, products: IProduct[],
    resPerPage? : number, filteredProductsCount: number, productsCount: number 
  }  
  export interface AdminGetAllProductResponse{
    success: true, products: IProduct[]
  }  
   export interface AdminGetReviewsByIdResponse{
    success: true, reviews: reviews[]
  }  
   
  export interface SingleProductResponse{
    success: true, product: IProduct 
  }