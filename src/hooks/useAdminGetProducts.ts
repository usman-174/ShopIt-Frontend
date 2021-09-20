import useSWR from 'swr';
import { AdminGetAllProductResponse } from '../types/productI';

const useAdminGetProducts = (query: string) => {
    const { isValidating, data, error, mutate, revalidate } = 
    useSWR<AdminGetAllProductResponse>(`${query}`)
    // const {success,count,products,totalProducts} = data as AllProductResponse
    return { isValidating, ...data, error, mutate, revalidate }
}

export default useAdminGetProducts
