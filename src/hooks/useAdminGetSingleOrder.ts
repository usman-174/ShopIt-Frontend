

import useSWR from 'swr';
import { IOrder } from '../types/OrderI';

interface myOrdersResponse {
    success: boolean,
    order: IOrder
}

const useAdminGetSingleOrder = (query) => {
    const { isValidating, data, error, mutate, revalidate } = useSWR<myOrdersResponse>
        (query,
            {
                revalidateOnFocus: true
            })
    return { isValidating, ...data, error, mutate, revalidate }
}
export default useAdminGetSingleOrder
