import useSWR  from 'swr';
import User from '../types/UserI'

interface loginResponse{
    success:boolean,
    user : User
}

const useAdminGetUserById = (query) => {
const {isValidating,data ,error,mutate,revalidate} = useSWR<loginResponse>(query)
    
    return{isValidating,...data,error,mutate,revalidate}
}

export default useAdminGetUserById
