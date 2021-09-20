import { Box, Center, Divider, Heading, SimpleGrid, Text } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/media-query';
import React from 'react';
import { AiFillDashboard } from 'react-icons/ai';
import { FaListAlt, FaUserTie } from 'react-icons/fa';
import { FcEmptyFilter } from 'react-icons/fc';
import { SiProducthunt } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import SideBar from '../../components/admin/SideBar';
import useAdminGetAllUsers from '../../hooks/useAdminGetAllUsers';
import useAdminGetOrders from '../../hooks/useAdminGetOrders';
import useAdminGetProducts from '../../hooks/useAdminGetProducts';
const Dashboard = () => {
    const [isLargerThan768px] = useMediaQuery("(min-width: 768px)");
    const [isLargerThan692px] = useMediaQuery("(min-width: 692px)");
    const { success, isValidating, products } = useAdminGetProducts("/products/admin")
    const { success: usersSuccess, isValidating: userIsValidating, users } = useAdminGetAllUsers("/users/admin/users")
    const { success: orderSuccess, isValidating: orderIsValidating, orders, totalAmount } = useAdminGetOrders("/orders/admin")

    let outOfStock = 0
    products?.forEach(prod => { if (prod.stock === 0) { outOfStock += 1 } })
    if (!success && isValidating && !orderSuccess && orderIsValidating && !usersSuccess && userIsValidating) {
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
                    <Box p="4" >
                        <Heading textAlign="center" mb="10" mt="3" textColor="teal"><AiFillDashboard style={{
                            color: "teal", display: "inline-block",
                            marginBottom: "5px", marginRight: "3px"
                        }} />DashBoard</Heading>
                        <Box my="2" borderRadius="lg" shadow="md" border="2px" mx="auto" w="70%" bg="tomato">
                            <Text textAlign="center" fontSize="xl" p="10" fontWeight="bold">TOTAL AMOUNT ${totalAmount}</Text>

                        </Box>
                        <SimpleGrid columns={[2, 2, 4]} spacing={8} >
                            <Box my="2" borderRadius="lg" shadow="md" bg="aqua" minH="130px">
                                <Heading my="5" textAlign="center" p="3" fontSize={isLargerThan692px ? "xl" : "md"}>
                                    <SiProducthunt
                                        style={{
                                            color: "#FF6347", display: "inline-block",
                                            fontSize: "22px", marginBottom: "5px", marginRight: "3px"
                                        }} />
                                    PRODUCTS {products?.length}</Heading>
                                <Divider mt="3" />
                                <Link to="/dashboard/products"><Text as="p" my="2" textAlign="center" >View Details</Text></Link>
                            </Box>
                            <Box my="2" borderRadius="lg" shadow="md" bg="bisque" minH="130px">
                                <Heading my="5" textAlign="center" p="3" fontSize={isLargerThan692px ? "xl" : "md"}>
                                    <FaListAlt
                                        style={{
                                            color: "#FF6347", display: "inline-block",
                                            fontSize: "22px", marginBottom: "5px", marginRight: "3px"
                                        }} />
                                    ORDERS {orders?.length}</Heading>
                                <Divider mt="3" />
                                <Link to="/dashboard/orders"><Text as="p" my="2" textAlign="center" >View Details</Text></Link>

                            </Box>
                            <Box my="2" borderRadius="lg" shadow="md" bg="forestgreen" minH="130px">
                                <Heading my="5" textAlign="center" p="3" fontSize={isLargerThan692px ? "xl" : "md"}>
                                    <FaUserTie
                                        style={{
                                            color: "#FF6347", display: "inline-block",
                                            fontSize: "22px", marginBottom: "5px", marginRight: "3px"
                                        }} />
                                    USERS {users?.length}
                                </Heading>
                                <Divider mt="3" />
                                <Link to="/dashboard/users"><Text as="p" my="2" textAlign="center" >View Details</Text></Link>

                            </Box>
                            <Box my="2" borderRadius="lg" shadow="md" bg="deepskyblue" minH="130px" >
                                <Heading my="5" textAlign="center" p="3" fontSize={isLargerThan692px ? "xl" : "md"}>
                                    <FcEmptyFilter
                                        style={{
                                            color: "#FF6347", display: "inline-block",
                                            fontSize: "22px", marginBottom: "5px", marginRight: "3px"
                                        }} />
                                    OUT OF STOCK {outOfStock}</Heading>
                            </Box>

                        </SimpleGrid>
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default Dashboard
