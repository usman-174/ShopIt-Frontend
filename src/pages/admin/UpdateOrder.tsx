import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Box, Center, Divider, Flex, Heading, Text } from '@chakra-ui/layout'
import { useMediaQuery } from '@chakra-ui/media-query'
import { Select } from '@chakra-ui/select'
import { useToast } from '@chakra-ui/toast'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { MoonLoader } from 'react-spinners'
import SideBar from '../../components/admin/SideBar'
import useAdminGetSingleOrder from '../../hooks/useAdminGetSingleOrder'

const UpdateOrder = ({ match }) => {
    const [isLargerThan768px] = useMediaQuery("(min-width: 768px)");
    const [isLargerThan380px] = useMediaQuery("(min-width: 380px)");

    const toast = useToast()
    const history = useHistory()

    const { isValidating, success, order, revalidate } = useAdminGetSingleOrder("/orders/" + match.params.id)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)


    const updateOrder = async () => {
        try {
            setLoading(true)
            const { data } = await axios.put(`/orders/admin/${match.params.id}`, { orderStatus: status })
            if (data?.success) {
                toast({
                    title: "Success",
                    description: "Order Status Updated.",
                    status: "success",
                    duration: 1300,
                    isClosable: true,
                    position: 'top-right'
                })
                setLoading(false)
                history.goBack()
                revalidate()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Sorry, Please try later.",
                status: "error",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            setLoading(false)
        }
    }

    useEffect(() => {
        if (order && success) {

            setStatus(order.orderStatus!)
        }
    }
        , [order, success])
    if (!success && isValidating) {
        return <Center my='20'>
            <MoonLoader color='#FF6347' />
        </Center>
    }


    return (
        <Box className="container-fluid" minH={"80vh"}>
            <Box className="row mx-2">
                {/* SIDEBAR */}
                <Box className="col-12 col-md-2" bg={!isLargerThan768px ? 'teal' : ""}>
                    <SideBar row={isLargerThan768px ? false : true} />
                </Box>
                {/* DASHBOARD */}
                <Box className="col-12 col-md-10" >
                    {order && <Box className="row">
                        {/* DETAILS */}
                        <Box className="col-md-9 col-sm-12">
                            <Heading textAlign="left" textColor="teal" fontSize="xx-large" mx="5" my="10">
                                Order # {order._id}</Heading>
                            <Heading fontSize="xl"   >Shipping info</Heading>
                            <Box m="5">

                                <Text my="1" fontWeight="bold">Name : <Text d="inline-block" fontWeight="normal" mx="2">{order.user?.name}</Text></Text>
                                <Text my="1" fontWeight="bold">PhoneNo : <Text d="inline-block" fontWeight="normal" mx="2">{order.shippingInfo?.phoneNo}</Text></Text>
                                <Text my="1" fontWeight="bold">Address : <Text d="inline-block" fontWeight="normal" mx="2">{order.shippingInfo?.address}</Text></Text>
                                <Text my="1" fontWeight="bold">Amount : <Text d="inline-block" fontWeight="normal" mx="2">{order.totalPrice}$</Text></Text>
                            </Box>
                            <Divider my="1" />
                            <Heading fontSize="xl">Payment : </Heading>
                            <Box m={5}>

                                <Text my="1" fontWeight="bold">Status : <Text d="inline-block" mx="2" fontWeight="normal"
                                    textColor={order.paymentInfo?.status === "succeeded" ? "green.400" : "tomato"}
                                >{order.paymentInfo?.status === "succeeded" ? "PAID" : "Not Paid."}</Text></Text>
                                {order.paymentInfo?.status === "succeeded" && <Text my="1" fontWeight="bold">PaidAt :
                                    <Text d="inline-block" mx="2" fontWeight="normal">{order.paidAt!.substr(0, 10)}</Text></Text>}
                            </Box>
                            <Divider my="1" />
                            <Heading fontSize="xl"   >ORDER STATUS </Heading>
                            <Box m="3">

                                <Text my="1" fontSize="lg" fontWeight="normal"
                                    textColor={order.orderStatus?.toLocaleLowerCase() === "processing" ? "tomato" : "green"}
                                >{order.orderStatus}</Text>
                            </Box>
                            <Divider my="1" />
                            <Heading fontSize="xl"   >ORDER Items </Heading>
                            <Box m="3">
                                <Box className="col-12">
                                    <Flex alignItems="center" flexDirection="column" my="5" justify="flex-start">

                                        {order.orderItems?.map(item => (<Flex my="2" key={item.quantity! * 1.673} w="90%" align="center"
                                            justifyContent="space-around" shadow="md" borderRadius="md"
                                            boxShadow="md" borderWidth="2px" >
                                            <Image src={item.image} alt={item.name} objectFit="contain" w={isLargerThan380px ? "10vw" : "18vw"} h={isLargerThan380px ? "8vh" : "13vh"} />
                                            <Text mx="1" maxW="43%" fontSize="lg" isTruncated>{item.name} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, beatae?</Text>

                                            <Text mx="1" maxW="43%" fontSize="lg" >{item.quantity} Piece(s)</Text>

                                            <Text d="inline-block" fontWeight="bold"> {" "}{(item.quantity! * item.price!).toFixed(2)}$</Text>
                                        </Flex>))}
                                    </Flex>
                                </Box>

                            </Box>


                        </Box>

                        {/* STATUS */}
                        <Box className="col-md-3 col-sm-12">
                            <Heading textAlign="center" my="5" textColor="teal.500">Status</Heading>
                            <Select my="5" defaultChecked={true} defaultValue={order.orderStatus}>
                                <option value="Processing" onClick={() => setStatus("Processing")}>Processing</option>
                                <option value="Shipped" onClick={() => setStatus("Shipped")}>Shipped</option>
                                <option value="Delivered" onClick={() => setStatus("Delivered")}>Delivered</option>
                            </Select>
                            {order.orderStatus !== status && <Center>

                                <Button textAlign="center" isLoading={loading} colorScheme="teal" my="2" onClick={updateOrder}>Update Order</Button>
                            </Center>}
                        </Box>

                    </Box>}

                </Box>
            </Box>

        </Box>

    )
}

export default UpdateOrder
