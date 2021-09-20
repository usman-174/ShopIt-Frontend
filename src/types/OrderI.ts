import User from "./UserI"

export interface ShippingInfo {
    address: string
    country: string
    postalCode: number
    city: string
    phoneNo: string
}
export interface cartItem {
    product?: string
    quantity?: number
    name?: string
    price?: number
    image?: string
    stock?: number

}

type paymentInfo = {
    id: string
    status: string
    
}
export interface IOrder  {
        _id?:string
        shippingInfo?: ShippingInfo
        user?: User
        orderItems?: cartItem[]
        paymentInfo?: paymentInfo
        paidAt?: string
        itemsPrice?: number
        taxPrice?: number
        shippingPrice?: number
        totalPrice?: number
        orderStatus?: string
        deilveredAt? : Date|number
    }
    export interface AdminGetAllOrderResponse{
        success: true, orders: IOrder[],totalAmount:number
      } 