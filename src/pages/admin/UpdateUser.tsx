import { Box, Heading } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/media-query';
import { Button, Center, FormControl, FormLabel, Input, Select, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdCreateNewFolder } from 'react-icons/md';
import { useHistory } from 'react-router';
import { MoonLoader } from 'react-spinners';
import SideBar from '../../components/admin/SideBar';
import useAdminGetUserById from '../../hooks/useAdminGetUserById';

const UpdateUser = ({ match }) => {
    const history = useHistory()
    const { success, user, isValidating, revalidate } = useAdminGetUserById(`/users/admin/user/${match.params.id}`)

    const [isLargerThan768px] = useMediaQuery("(min-width: 768px)");


    const toast = useToast()

    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [role, setRole] = React.useState("")
    const [loading, setLoading] = useState(false)



    const submitUser = async () => {
        let formData: any = {}

        if (name === user?.name && email === user?.email
            && role === user?.role) {
            toast({
                title: "Details are same as Before",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        if (name !== user?.name) {
            formData.name = name
        }
        if (email !== user?.email) {
            formData.email = email
        }
        if (role !== user?.role) {
            formData.role = role
        }

        try {
            setLoading(true)

            const { data } = await axios.put(`/users/admin/user/${match.params.id}`, formData)
            if (data.success) {
                toast({
                    title: "Sucess",
                    status: "success",
                    duration: 1300,
                    isClosable: true,
                    position: 'top-right'
                })
                history.goBack()
                revalidate()
                setLoading(false)

            }

        } catch (error) {
            toast({
                title: "Faled",
                description: error.response.data.message || "Failed to create the product.",
                status: "error",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
        } finally {
            setLoading(false)

        }
    }
    useEffect(() => {
        if (success && user) {
            setName(user.name!)
            setEmail(user.email!)
            setRole(user.role)
        }
    },
        [success, user])
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
                <Box className="col-12 col-md-10" >
                    <Heading textAlign="center" mb="10" mt="3" textColor="teal"><MdCreateNewFolder style={{
                        color: "teal", display: "inline-block",
                        marginBottom: "5px", marginRight: "3px"
                    }} />Update User</Heading>
                    <Box p={8} mx="auto" maxWidth={isLargerThan768px ? "55%" : "70%"} borderWidth={1} borderRadius={8} boxShadow="lg">
                        <FormControl id="Name">
                            <FormLabel>Name</FormLabel>
                            <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name..." />
                        </FormControl>
                        <FormControl id="Email">
                            <FormLabel>Email</FormLabel>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Product Name..." />
                        </FormControl>
                        <FormControl id="Role">
                            <FormLabel>Role</FormLabel>
                            <Select defaultChecked={true} defaultValue={user?.role}>
                                <option value="admin" onClick={() => setRole("admin")}>ADMIN</option>
                                <option value="user" onClick={() => setRole("user")}>USER</option>
                            </Select>
                        </FormControl>


                        <FormControl mx="auto" mt="5" textAlign="center">
                            <Button isLoading={loading} onClick={submitUser}
                                colorScheme="teal">Update</Button>
                        </FormControl>

                    </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default UpdateUser
