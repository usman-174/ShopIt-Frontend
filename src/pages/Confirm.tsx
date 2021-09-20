import { Box, Divider, Flex, Heading, Image, Text, useMediaQuery, Center, Button } from '@chakra-ui/react'
import React, { Fragment } from 'react'
import Step from '../components/layout/Step'
import MetaData from '../components/MetaData'
import { useAuthState } from '../Context/auth'
import { cartItem, ShippingInfo } from '../Context/cart'

const Confirm = ({ cart: { shippingInfo, cartItems }, history }: { cart: { cartItems: cartItem[], shippingInfo: ShippingInfo }, history: any }) => {
    const [isLargerThan830px] = useMediaQuery("(min-width: 830px)");
    const [isLargerThan550px] = useMediaQuery("(min-width: 550px)");
    const [isLargerThan380px] = useMediaQuery("(min-width: 380px)");
    const [isLargerThan700px] = useMediaQuery("(min-width: 700px)");

    const auth = useAuthState()

    const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price! * item.quantity!), 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 30
    const taxPrice = Number((0.25 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    const proceedToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice, taxPrice, totalPrice
        }
        sessionStorage.setItem("orderInfo", JSON.stringify(data))
        history.push("/order/payment")

    }
    return (
        <Fragment>
            <MetaData title="Confirm Order" />
            <Box className="container-fluid" minH={isLargerThan700px ? "80vh" : ""}>
                <Center mt="10">
                    <Step step={2} />

                </Center>
                <Divider mt="2" mx="auto" w="70%" />
                <Box className="row" mt={isLargerThan380px ? "20" : 8} minH="70vh">
                    <Box className={`${isLargerThan550px ? "col-7" : "col-12"} text-center  justify-content-center `}>
                        <Heading textAlign="center" textColor="tomato">Shipping Info</Heading>
                        <Box my={isLargerThan550px ? "20" : "5"} p="5" mx="auto" maxW={isLargerThan830px ? "40%" : isLargerThan550px ? "60%" : "80%"} shadow="md" borderRadius="md"
                            boxShadow="md" borderWidth="1px" borderColor="white" fontWeight="bold">
                            <Flex my="1" alignItems="center" justifyContent="space-around">
                                <Text as="p" fontSize="lg" fontWeight="bold">
                                    Name
                                </Text>
                                <Text fontWeight="md">
                                    {auth.user?.name}
                                </Text>

                            </Flex>
                            <Flex my="1" alignItems="center" justifyContent="space-around">
                                <Text as="p" fontSize="lg" fontWeight="bold">
                                    Phone
                                </Text>
                                <Text fontWeight="md">
                                    {shippingInfo.phoneNo}
                                </Text>

                            </Flex>
                            <Flex my="1" alignItems="center" justifyContent="space-around">
                                <Text as="p" fontSize="lg" fontWeight="bold">
                                    Address
                                </Text>
                                <Text fontWeight="md">
                                    {shippingInfo.address}
                                </Text>

                            </Flex>
                        </Box>

                        <div className="col-12">
                            <Flex alignItems="center" flexDirection="column" my="2" justify="flex-start">
                                <Heading my="10" textColor="tomato">Cart Items:</Heading>
                                {cartItems.map(item => (<Flex my="2" key={item.quantity! * 1.673} w="90%" align="center"
                                    justifyContent="space-around" shadow="md" borderRadius="md"
                                    boxShadow="md" borderWidth="2px" >
                                    <Image src={item.image} alt={item.name} objectFit="contain" w={isLargerThan380px ? "10vw" : "18vw"} h={isLargerThan380px ? "8vh" : "13vh"} />
                                    <Text mx="1" maxW="43%" fontSize="lg" isTruncated>{item.name} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, beatae?</Text>
                                    <Text fontSize="lg">{item.quantity} * {item.price}${" "} =
                                        <Text d="inline-block" fontWeight="bold"> {" "}{(item.quantity! * item.price!).toFixed(2)}$</Text></Text>
                                </Flex>))}
                            </Flex>
                        </div>
                    </Box>
                    <Box className={` ${isLargerThan550px ? "col-4" : "col-12"} p-1 text-center`} >
                        <Heading textAlign="center" textColor="tomato">Summary</Heading>
                        <Box my={isLargerThan550px ? "20" : "5"} p="5" mx="auto"
                            maxW={isLargerThan830px ? "60%" : isLargerThan550px ? "70%" : "80%"}
                            shadow="md"
                            borderEndColor="tomato"
                            borderRadius="md" boxShadow="md" borderWidth="1px"
                            borderColor="white" fontWeight="bold">
                            {/* <Text m="2" >Items Price = {itemsPrice}$</Text> */}
                            <Flex my="1" alignItems="center" justifyContent="space-around">
                                <Text as="p" fontSize="lg" fontWeight="semibold">
                                    Items Price
                                </Text>
                                <Text fontWeight="normal">
                                    {itemsPrice}$
                                </Text>

                            </Flex>
                            <Flex my="2" alignItems="center" justifyContent="space-around">
                                <Text as="p" fontSize="lg" fontWeight="semibold">
                                    Shipping Price
                                </Text>
                                <Text fontWeight="normal">
                                    {shippingPrice}$
                                </Text>

                            </Flex>
                            <Divider />
                            <Flex my="2" alignItems="center" justifyContent="space-around">
                                <Text as="p" fontSize="lg" fontWeight="bold">
                                    TOTAL
                                </Text>
                                <Text fontWeight="md">
                                    {totalPrice}$
                                </Text>

                            </Flex>
                            <Flex flexDirection="column" my="2" alignItems="center" justifyContent="space-around">
                                <Divider my="2" />
                                <Button colorScheme="teal" mx="auto" onClick={proceedToPayment}>Process to Payment</Button>

                            </Flex>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Fragment>
    )
}

export default Confirm
