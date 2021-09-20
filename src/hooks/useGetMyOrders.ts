

import useSWR  from 'swr';
import { IOrder } from '../types/OrderI';

interface myOrdersResponse{
    success:boolean,
    orders : IOrder[]
}

const useGetMyOrders = () => {
    const { isValidating, data, error, mutate, revalidate } = useSWR<myOrdersResponse>(`/orders/my`,
    {
        revalidateOnFocus: true
    })
return { isValidating, ...data, error, mutate, revalidate }
}
export default useGetMyOrders
