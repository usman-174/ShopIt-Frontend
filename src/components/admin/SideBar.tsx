import { Flex, Heading, Text } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { FaListAlt, FaUserTie } from 'react-icons/fa'
import { BsStarHalf } from 'react-icons/bs'
import { SiProducthunt } from 'react-icons/si'
import { Link, useHistory } from 'react-router-dom'

const SideBar = ({ row }) => {
    const history = useHistory()
    return (
        <Flex my={row ? "2" : "0"} flexDirection={row ? "row" : "column"} borderRight={!row ? "2px" : "none"} h={!row ? "95vh" : ""} justifyContent={row ? "space-around"
            : "flex-start"} alignItems="cetner">
            {!row && <Heading my="10" fontSize="xl" cursor="pointer" onClick={() => history.push("/dashboard")} textAlign="center">DashBoard</Heading>}
            <Text textAlign="center" my="2" d={row ? "inline-block" : ""} mx={row ? "5" : ""} fontSize={"lg"} fontWeight="bold">
                <SiProducthunt style={{ color: "#FF6347", display: "inline-block", fontSize: "22px", marginBottom: "2px", marginRight: "5px" }} />

                <Menu>
                    <MenuButton style={{ color: "#646464", fontWeight: "bold" }}
                        transition="all 0.2s" _hover={{ bg: "gray.400" }}
                    >
                        Products </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => history.push("/dashboard/products")}>All</MenuItem>
                        <MenuItem onClick={() => history.push("/dashboard/products/new")}>Create a Product</MenuItem>
                    </MenuList>
                </Menu>
            </Text>
            <Text textAlign="center" textColor="WindowFrame" my="2" d={row ? "inline-block" : ""} mx={row ? "5" : ""} fontSize="lg" fontWeight="bold">
                <Link to="/dashboard/users" style={{ textDecoration: "none", color: "#646464" }} ><FaUserTie
                    style={{ color: "#FF6347", marginBottom: "2px", fontSize: "22px", display: "inline-block", marginRight: "5px" }} />
                    Users</Link>
            </Text>
            <Text textAlign="center" textColor="WindowFrame" my="2" d={row ? "inline-block" : ""} mx={row ? "5" : ""} fontSize="lg" fontWeight="bold">
                <Link to="/dashboard/orders" style={{ textDecoration: "none", color: "#646464" }} > <FaListAlt style={{
                    color: "#FF6347",
                    display: "inline-block", marginRight: "5px",
                    marginBottom: "2px", fontSize: "22px"
                }} />
                    Order </Link>
            </Text>
            <Text textAlign="center" textColor="WindowFrame" my="2" d={row ? "inline-block" : ""} mx={row ? "5" : ""} fontSize="lg" fontWeight="bold">
                <Link to="/dashboard/reviews" style={{ textDecoration: "none", color: "#646464" }} >
                    <BsStarHalf style={{
                        color: "#FF6347",
                        display: "inline-block", marginRight: "5px",
                        marginBottom: "2px", fontSize: "22px"
                    }} />
                    Reviews </Link>
            </Text>

        </Flex>
    )
}

export default SideBar