import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Heading } from '@chakra-ui/layout';
import { Icon, useMediaQuery, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import React, { Fragment, useEffect } from 'react';
import { MoonLoader } from 'react-spinners';
import { Link } from 'react-router-dom'
import SideBar from '../../components/admin/SideBar';
import useAdminGetAllUsers from '../../hooks/useAdminGetAllUsers';

const UsersList = () => {
    const toast = useToast()
    const { success, isValidating, users, revalidate } = useAdminGetAllUsers("/users/admin/users")
    const [isLargerThan768px] = useMediaQuery("(min-width: 768px)");
    useEffect(() => {
        revalidate()
    },
        // eslint-disable-next-line
        [])
    const deleteAdminUser = async (id: string) => {
        console.log("Dlete UserId=", id);

        const { data } = await axios.delete("/users/admin/user/" + id)
        if (data?.success) {
            toast({
                title: "Success",
                description: `User Deleted Successfully.`,
                status: "success",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            revalidate()
        }
        return
    }
    const setUsers = () => {
        const data: { columns: any[], rows: any[] } = {
            columns: [
                {
                    label: "User ID", field: 'id',
                    sort: "asc"
                },
                {
                    label: "Name", field: 'name',
                    sort: "asc"
                },
                {
                    label: "Email", field: 'email',
                    sort: "asc"
                },
                {
                    label: "Role", field: 'role',
                    sort: "asc"
                },
                {
                    label: "Actions", field: 'actions',
                    sort: "asc"
                },
            ], rows: []
        }
        users?.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: <Flex alignItems="Center" justifyContent="space-around" >
                    <Link to={`/dashboard/users/${user._id}`}>
                        <Icon textAlign="center" as={EditIcon} color="teal.700" w={9} h={9} />
                    </Link>

                    <Icon onClick={() => deleteAdminUser(user._id!)} cursor="pointer" mx="2" textAlign="center"
                        as={DeleteIcon} color="tomato" w={8} h={8} />
                </Flex>
            })
        })
        return data
    }
    if (!success && isValidating) {
        return <Center my='20'>
            <MoonLoader color='#FF6347' />
        </Center>
    }
    return (
        <Box className="container-fluid" minH={"80vh"}>
            <Box className="row">
                {/* SIDEBAR */}
                <Box className="col-12 col-md-2" bg={!isLargerThan768px ? 'teal' : ""}>
                    <SideBar row={isLargerThan768px ? false : true} />
                </Box>
                {/* DASHBOARD */}
                <Box className="col-12 col-md-10"
                    textAlign={!isLargerThan768px ? "center" : "left"}>
                    {success && <Fragment>
                        <Box className="container my-5 ">
                            <Heading textAlign="center" my="10" as="h1" fontWeight="bold"
                                color="teal">All Users</Heading>
                            <MDBDataTable
                                data={setUsers()}
                                hover
                                striped
                                bordered
                                className="px-3"
                            />
                        </Box>

                    </Fragment>}
                </Box>
            </Box>

        </Box>
    )
}


export default UsersList
