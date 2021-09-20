import { ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Button, Flex, Box, Link, Menu, MenuButton, MenuItem, MenuList, Text, useMediaQuery, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { MdAddShoppingCart } from "react-icons/md"
import { Link as ReachLink, Route, useHistory } from 'react-router-dom';
import { useAuthDispatch, useAuthState } from '../../Context/auth';
import { useCartState } from '../../Context/cart';
import Search from './Search';
function Header() {
    const history = useHistory()
    const toast = useToast()
    const [isLargerThan580px] = useMediaQuery("(min-width: 580px)");
    const [isLargerThan794px] = useMediaQuery("(min-width: 794px)");
    const [isLargerThan958px] = useMediaQuery("(min-width: 958px)");
    const [isLargerThan450px] = useMediaQuery("(min-width: 450px)");
    const { user } = useAuthState()
    const dispatch = useAuthDispatch()
    const cart = useCartState()

    const Logout = async () => {
        try {
            await axios.get('users/logout')
            dispatch("LOGOUT")
            window.location.reload()
        } catch ({ response }) {
            toast({
                title: "Logout Failed",
                description: response.data.message,
                status: "error",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
        }
    }
    return (
        <Flex alignItems='center' flexDirection={isLargerThan794px ? 'row' : 'column'} justifyContent='space-between'
            bg="tomato" w="100%" py={isLargerThan794px ? 4 : 1} px={2} color="white">
            <Flex px="3" my={1} alignItems="center" justifyContent="space-around" flexDirection={isLargerThan450px ? "row" : "column"}>

                <Text as='h1' my={!isLargerThan958px ? "1" : "0"} fontSize='2xl'><Link as={ReachLink} style={{ textDecoration: "none" }} to="/">Ecommerce </Link></Text>
                <Flex mx={5} d={isLargerThan794px ? "block" : "flex"}>
                    <Route render={({ location, match }) => <Search match={match} location={location} />} />
                </Flex>
            </Flex>
            <Flex flexDirection='row' align='center' mt={!isLargerThan580px ? "3" : "0"} justifyContent='center' >

                {!user ? <ReachLink to='/login'><Button mx='2' colorScheme='teal'>

                    Login</Button>
                </ReachLink>
                    : <><Menu>

                        <MenuButton textColor='teal'>
                            <Flex alignItems='center' justifyContent='center' >

                                <Avatar mx="2" name={user.name} src={user.avatar?.url} />
                                <Text fontWeight='bold' fontSize='lg'>{user.name?.toUpperCase()} </Text> <ChevronDownIcon />
                            </Flex>

                        </MenuButton>
                        <MenuList color='black' bg='teal.300' >
                            <MenuItem onClick={() => history.push(user.role === 'admin' ? "/dashboard" : "/orders")} >{user.role === 'admin' ? "Dashboard" : "Orders"} </MenuItem>
                            <MenuItem onClick={() => history.push("/profile")}>
                                Profile
                            </MenuItem><MenuItem onClick={Logout}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu> <Flex alignItems="center" justifyContent="center" mx="3" >

                            <Button onClick={() => history.push("/cart")} colorScheme="teal" color="white">
                                <Box fontSize="4xl" color="white">

                                    <MdAddShoppingCart />
                                </Box>
                                {cart.cartItems?.length ? cart.cartItems.length : 0}</Button>

                        </Flex></>}

            </Flex>
        </Flex >
    )
}

export default Header