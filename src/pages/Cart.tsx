import { Box, Button, Center, Flex, Heading, Text, useMediaQuery, Divider } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import CartProduct from "../components/cart/CartProduct"
import { cartItem } from "../Context/cart"

const Cart = ({ cart: { cartItems } }: { cart: { cartItems: cartItem[] } }) => {
    const [isLargerThan380px] = useMediaQuery("(min-width: 380px)");
    const [isLargerThan700px] = useMediaQuery("(min-width: 700px)");


    return (<>

        {cartItems.length && <Box className="container-fluid" minH={isLargerThan700px ? "79vh" : ""} mt={10}>
            <div className="row">
                <Box className="col-sm-12 col-md-8" p="2">
                    <Box m="5">

                        <Heading as="main" my="5" textAlign={isLargerThan380px ? undefined : "center"}>Cart Items : {cartItems.length}</Heading>
                        <Box className="row" textAlign={isLargerThan380px ? undefined : "center"} >
                            {cartItems?.map(item =>
                                <CartProduct item={item} key={item.price! * Math.random() * 1.673} />
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box className="col-sm-12 col-md-3 col-md-offset-2 align-middle" p="2" mt={isLargerThan700px ? "12" : "5"} >
                    <Box shadow="md" className="my-lg-5" borderRadius="md" my="auto"
                        boxShadow="md" borderWidth="1px" p="3">

                        <Heading my="4" fontSize="xl" textAlign="center">ORDER SUMMARRY </Heading>
                        <Divider />
                        <Box my="2">
                            <Flex alignItems="center" justifyContent="space-around">
                                <Text as="p" fontSize="lg" fontWeight="bold">
                                    Subtotal:
                                </Text>
                                <Text fontWeight="md">
                                    {cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)} units
                                </Text>

                            </Flex>
                            <Flex alignItems="center" justifyContent="space-around">
                                <Text fontSize="lg" fontWeight="bold">
                                    Est. Total:
                                </Text>
                                <Text fontWeight="md">
                                    $ {cartItems.reduce((acc, item) => acc + Number(item.quantity! * item.price!), 0).toFixed(2)}
                                </Text>

                            </Flex>
                        </Box>

                        <Center my="5">
                            <Link to="/shipping">
                                <Button colorScheme="teal" my="2"> CHECKOUT </Button>
                            </Link>
                        </Center>
                    </Box>
                </Box>

            </div>
        </Box>}</>
    )
}

export default Cart
