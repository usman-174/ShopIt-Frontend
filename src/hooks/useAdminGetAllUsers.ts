import useSWR from 'swr';
import { AdminGetAllUsersResponse } from '../types/UserI';

const useAdminGetAllUsers = (query: string) => {
    const { isValidating, data, error, mutate, revalidate } = 
    useSWR<AdminGetAllUsersResponse>(`${query}`)
    // const {success,count,products,totalProducts} = data as AllProductResponse
    return { isValidating, ...data, error, mutate, revalidate }
}

export default useAdminGetAllUsers
