import { Button } from '@chakra-ui/button'
import Icon from '@chakra-ui/icon'
import { ViewIcon } from '@chakra-ui/icons'
import { Box, Center, Heading } from '@chakra-ui/layout'
import { MDBDataTable } from 'mdbreact'
import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import MetaData from '../components/MetaData'
import useGetMyOrders from '../hooks/useGetMyOrders'

const Orders = ({ history }) => {
    const { isValidating, success, orders, error, revalidate } = useGetMyOrders()
    if (isValidating) {
        <Center mx="auto" textAlign="center" my="20">
            <MoonLoader color='#999' />
        </Center>
    }
    useEffect(() => {
        revalidate()
    },
        // eslint-disable-next-line
        [])
    const setOrders = () => {
        const data: { columns: any[], rows: any[] } = {
            columns: [
                {
                    label: "ORDER ID", field: 'id',
                    sort: "asc"
                },
                {
                    label: "Number of Items", field: 'numOfItems',
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
                numOfItems: order.orderItems?.length,
                amount: order.totalPrice + "$",
                status: order.orderStatus,
                // status: order.orderStatus?.includes("vered") ? <Text textColor="tomato" fontWeight="medium">Delivered</Text> : <Text textColor="tomato" fontWeight="medium">Processing</Text>,
                actions: <Link to={`/order/${order._id}`}><Icon mx="auto" textAlign="center" as={ViewIcon} color="teal.700" w={10} h={10} /></Link>
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
        <Fragment>
            <MetaData title="My Orders" />
            <Box className="container my-5">
                {orders?.length ?
                    <Box className="my-5">
                        <Heading textAlign="center" my="10" as="h1" fontWeight="bold" color="tomato">My Orders</Heading>
                        <MDBDataTable
                            data={setOrders()}
                            hover
                            striped
                            bordered
                            className="px-3"
                        />
                    </Box>
                    :
                    <Box className="my-5 " minH={"80vh"}>
                        <Heading textAlign="center" my="10" as="h1"
                            fontWeight="bold" color="tomato">
                            {error && error.message}</Heading>
                        <Center>
                            <Button my="10" onClick={() => history.push("/")} textAlign="center" mx="auto" colorScheme="teal">
                                Go Find Some Products.
                            </Button>
                        </Center>
                    </Box>

                }
            </Box>
        </Fragment>

    )
}

export default Orders
