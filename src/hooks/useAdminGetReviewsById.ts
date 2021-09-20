import useSWR from 'swr';
import { AdminGetReviewsByIdResponse } from '../types/productI';

const useAdminGetReviewsById = (id:string) => {
    const { isValidating, data, error, mutate, revalidate } = 
    useSWR<AdminGetReviewsByIdResponse>(`/products/reviews?id=${id}`)
    // const {success,count,products,totalProducts} = data as AllProductResponse
    return { isValidating, ...data, error, mutate, revalidate }
}

export default useAdminGetReviewsById
