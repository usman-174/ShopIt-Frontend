import { FormLabel } from '@chakra-ui/form-control'
import { Box, Divider } from '@chakra-ui/layout'
import { Button, Flex, FormControl, Heading, useMediaQuery, useToast } from '@chakra-ui/react'
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import React, { useState } from 'react'
import Step from '../components/layout/Step'
import MetaData from '../components/MetaData'
import { IOrder } from "../types/OrderI"
import { useAuthState } from '../Context/auth'
import { cartItem, ShippingInfo, useCartDispatch } from '../Context/cart'

const options = {
    style: {
        base: {
            fontSize: "16px"
        },
        invalid: {
            color: "#9e2146"
        }
    }
}
const PaymentPage = ({ history, cart: { cartItems, shippingInfo } }: { cart: { cartItems: cartItem[], shippingInfo: ShippingInfo }, history: any }) => {

    const [isLargerThan830px] = useMediaQuery("(min-width: 830px)");
    const [isLargerThan375px] = useMediaQuery("(min-width: 375px)");
    const [loading, setloading] = useState(false)
    const [paid, setPaid] = useState(false)
    const orderInfo = JSON.parse(String(sessionStorage.getItem("orderInfo")))
    const stripe = useStripe()
    const elements = useElements()
    const { user } = useAuthState()
    const dispatch = useCartDispatch()
    const toast = useToast()
    const paymentData = {
        amount: Math.round(orderInfo?.totalPrice * 100)
    }
    const order: IOrder = {
        orderItems: cartItems,
        shippingInfo,

    }
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }
    const visitOrders = () => {
        sessionStorage.removeItem("orderInfo")
        history.push("/orders")
        dispatch("EMPTY_CART")
    }
    const PayBill = async () => {
        setloading(true)

        try {
            const { data } = await axios.post('/payment/process', paymentData, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer YOUR_SECRET_KEY`
                }
            })
            if (!stripe || !elements) {
                setloading(false)

                return
            }

            const result = await stripe.confirmCardPayment(data.clientsecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement)!,
                    billing_details: {
                        email: user?.email,
                        name: user?.name,
                    }
                }
            })
            if (result.error) {
                toast({
                    title: "Payment Failed",
                    description: result.error.message,
                    status: "error",
                    duration: 1500,
                    isClosable: true,
                    position: 'top-right'
                })
                return
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    await axios.post("/orders/create", order)
                    setPaid(true)
                    toast({
                        title: "Payment Success",
                        description: `${result.paymentIntent.amount}$ Sucessfully Payed. Your order has been placed.`,
                        status: "success",
                        duration: 1500,
                        isClosable: true,
                        position: 'top-right'
                    })

                } else {
                    setloading(false)
                    toast({
                        title: "Payment Failed",
                        description: `There was an error. Try later`,
                        status: "error",
                        duration: 1500,
                        isClosable: true,
                        position: 'top-right'
                    })
                }
            }
            setloading(false)

        } catch (error) {
            toast({
                title: "Error",
                description: error.response.data.message,
                status: "error",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            setloading(false)

        } finally {
            setloading(false)

        }
    }

    return (
        <Box className='container' minH="70vh">
            <MetaData title='Payment' />
            {!paid ? <><Step step={3} />
                <Divider mx="auto" w="50%" mt="5" />
                <Flex my="10" mx="auto" shadow="md" borderWidth="2px" borderRadius="md"
                    w={isLargerThan830px ? "30vw" : isLargerThan375px ? "65vw" : "90vw"} flexDirection="column"
                    alignItems='center' justifyContent='center' p="2">

                    <Heading textAlign='center' my="5" textColor='teal'>Payment</Heading>
                    <FormControl w={isLargerThan830px ? "40%" : isLargerThan375px ? '60%' : '90%'}>
                        <FormLabel>Card Number</FormLabel>
                        <CardNumberElement options={options} />
                    </FormControl>
                    <FormControl w={isLargerThan830px ? "40%" : isLargerThan375px ? '60%' : '90%'} id="password" my="4">
                        <FormLabel>Card Expiry</FormLabel>
                        <CardExpiryElement options={options} />
                    </FormControl>
                    <FormControl w={isLargerThan830px ? "40%" : isLargerThan375px ? '60%' : '90%'} id="password" my="4">
                        <FormLabel>Card Cvc</FormLabel>
                        <CardCvcElement options={options} />
                    </FormControl>


                    <Flex my="3">
                        <Button isLoading={loading} onClick={PayBill} variant='outline' colorScheme='teal' color='tomato'>
                            Pay {` - ${orderInfo.totalPrice}$`}
                        </Button>
                    </Flex>

                </Flex> </> : <><Box mx="auto" textAlign="center" my="20">
                    <Heading as="h1" fontSize="lg" my="5">ORDER PLACED SUCCESSFULLY</Heading>

                    <Button onClick={visitOrders} color="white" colorScheme="messenger">MY ORDERS</Button>
                </Box></>}
        </Box>
    )
}

export default PaymentPage
