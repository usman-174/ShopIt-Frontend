import useSWR from 'swr';
import { AdminGetAllOrderResponse } from '../types/OrderI';

const useAdminGetOrders = (query: string) => {
    const { isValidating, data, error, mutate, revalidate } = 
    useSWR<AdminGetAllOrderResponse>(`${query}`)
    // const {success,count,products,totalProducts} = data as AllProductResponse
    return { isValidating, ...data, error, mutate, revalidate }
}

export default useAdminGetOrders
