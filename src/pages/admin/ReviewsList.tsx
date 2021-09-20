import { Button } from '@chakra-ui/button'
import { DeleteIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/input'
import { Box, Heading } from '@chakra-ui/layout'
import { useMediaQuery } from '@chakra-ui/media-query'
import { Icon, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { MDBDataTable } from 'mdbreact'
import React, { Fragment, useState } from 'react'
import SideBar from '../../components/admin/SideBar'
import useAdminGetReviewsById from '../../hooks/useAdminGetReviewsById'

const ReviewsList = () => {
    const toast = useToast()
    const [productId, setProductId] = useState("")
    const [query, setQuery] = useState("")
    const [isLargerThan768px] = useMediaQuery("(min-width: 768px)");
    const { reviews, isValidating, success, revalidate } = useAdminGetReviewsById(query)

    const deleteAdminReview = async (id: string) => {
        const { data } = await axios.delete(`/products/review?id=${id}&productId=${productId}`)
        if (data?.success) {
            toast({
                title: "Success",
                description: `Review Deleted Successfully.`,
                status: "success",
                duration: 1300,
                isClosable: true,
                position: 'top-right'
            })
            revalidate()
        }
        return
    }
    const setReviews = () => {
        const data: { columns: any[], rows: any[] } = {
            columns: [
                {
                    label: "Review ID", field: 'id',
                    sort: "asc"
                },
                {
                    label: "Rating", field: 'rating',
                    sort: "asc"
                },
                {
                    label: "Comment", field: 'comment',
                    sort: "asc"
                },
                {
                    label: "User", field: 'user',
                    sort: "asc"
                },
                {
                    label: "Actions", field: 'actions',
                    sort: "asc"
                },
            ], rows: []
        }
        reviews?.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,
                actions:

                    <Icon onClick={() => deleteAdminReview(review._id!)} cursor="pointer" mx="2" textAlign="center"
                        as={DeleteIcon} color="tomato" w={8} h={8} />

            })
        })
        return data
    }


    return (
        <Box className="container">
            <Box className="row">
                {/* SIDEBAR */}
                <Box className="col-12 col-md-2" bg={!isLargerThan768px ? 'teal' : ""}>
                    <SideBar row={isLargerThan768px ? false : true} />
                </Box>
                <Box className="col-12 col-md-10" textAlign={!isLargerThan768px ? "center" : "left"}>
                    <Box className="row">
                        <Box className="col-12 mx-auto text-center">
                            <Heading my="2">Enter Product ID</Heading>
                            <Input my="2" value={productId} onChange={(e) => setProductId(e.target.value)}
                                w="60%" type="text"
                                placeholder="Enter Product ID..." />
                            <br />
                            {/* {error && <Text>{error}</Text>} */}
                            <Button onClick={() => setQuery(productId)} colorScheme="teal" textAlign="center" my="2">Get Reviews</Button>
                        </Box>
                        <Box p="2" mx="2" className="col-12">
                            {success && !isValidating && <Fragment>
                                <Box className="container my-5 ">
                                    <Heading textAlign="center" my="10" as="h1" fontWeight="bold"
                                        color="teal">All Reviews</Heading>
                                    <MDBDataTable
                                        data={setReviews()}
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

            </Box>
        </Box>
    )
}

export default ReviewsList
