import { StarIcon } from '@chakra-ui/icons'
import { Box, Text, Heading } from '@chakra-ui/layout'
import React from 'react'

const ShowReviews = ({ name, comment, rating }) => {
    return (
        <Box mb="20">
            <Heading as="h2" textAlign="center" my="3">Reviews</Heading>
            <Box my="4" mx="4" shadow="md" borderWidth="1px" borderRadius="md" maxW="40vw">
                <Text fontWeight="bold" mx="4" p="2">By {name}</Text>
                <Box mx="4" >

                    {Array(5)
                        .fill("")
                        .map((_, i) => (
                            <StarIcon boxSize='1rem' key={i}
                                color={i < Number(rating) ? "#f7fc20" : "gray.300"} />
                        ))}
                </Box>
                <Box p="1" mx="6">
                    {comment} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus, blanditiis?
                </Box>
            </Box></Box>
    )
}

export default ShowReviews
