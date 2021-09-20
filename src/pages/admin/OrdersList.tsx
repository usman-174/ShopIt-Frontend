import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Heading } from '@chakra-ui/layout';
import { Icon, useMediaQuery, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import SideBar from '../../components/admin/SideBar';
import useAdminGetOrders from '../../hooks/useAdminGetOrders';

const OrdersList = () => {
    const toast = useToast()
    const { success, isValidating, orders, revalidate } = useAdminGetOrders("/orders/admin")
    const [isLargerThan768px] = useMediaQuery("(min-width: 768px)");
    useEffect(() => {
        revalidate()
    },
        // eslint-disable-next-line
        [])
    const deleteAdminOrder = async (id: string) => {
        console.log("Dlete ProductId=", id);

        const { data } = await axios.delete("/orders/admin/" + id)
        if (data?.success) {
            toast({
                title: "Success",
                description: `Product Deleted Successfully.`,
                status: "success",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            revalidate()
        }
        return
    }
    const setProducts = () => {
        const data: { columns: any[], rows: any[] } = {
            columns: [
                {
                    label: "Order ID", field: 'id',
                    sort: "asc"
                },
                {
                    label: "No of Items", field: 'noOfItems',
                    sort: "asc"
                },
                {
                    label: "Amount", field: 'amount',
                    sort: "asc"
                },
                {
                    label: "Status", field: 'status',
                    sort: "asc"
                },
                {
                    label: "Actions", field: 'actions',
                    sort: "asc"
                },
            ], rows: []
        }
        orders?.forEach(order => {
            data.rows.push({
                id: order._id,
                noOfItems: order.orderItems?.length,
                amount: order.totalPrice + "$",
                status: order.orderStatus,
                actions: <Flex alignItems="Center" justifyContent="space-around" >
                    <Link to={`/dashboard/orders/${order._id}`}>
                        <Icon textAlign="center" as={EditIcon} color="teal.700" w={9} h={9} />
                    </Link>

                    <Icon onClick={() => deleteAdminOrder(order._id!)} cursor="pointer" mx="2" textAlign="center"
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
                <Box className="col-12 col-md-10" textAlign={!isLargerThan768px ? "center" : "left"}>
                    {success && <Fragment>
                        <Box className="container my-5 ">
                            <Heading textAlign="center" my="10" as="h1" fontWeight="bold" color="teal">
                                All Orders</Heading>
                            <MDBDataTable
                                data={setProducts()}
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


export default OrdersList
