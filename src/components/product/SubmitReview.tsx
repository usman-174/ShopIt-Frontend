import {
    Modal, Box, ModalBody, ModalFooter, Button,
    ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, FormControl,
    Textarea, useToast
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { Rating } from "react-simple-star-rating"
const SubmitReview = ({ isOpen, onClose, match, revalidate }) => {
    const toast = useToast()
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState("")
    const submitReview = async () => {
        const formData = { review, rating, productId: match.params.id }
        try {
            const { data } = await axios.put("/products/review", formData)
            if (data.success) {
                toast({
                    title: "Review Submitted",
                    status: "success",
                    duration: 1500,
                    isClosable: true,
                    position: 'top-right'
                })

                onClose()
                revalidate()
            }
        } catch (error) {
            toast({
                title: "Review Failed.",
                description: error?.response?.data?.message || "Couldn't submit the review please try later",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>REVIEW</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box my="5" textAlign="center">
                        <Rating onClick={(e) => setRating(e)} ratingValue={rating} size={30} />
                    </Box>
                    <FormControl id="review">
                        <Textarea placeholder="Please write a review." onChange={(e) => setReview(e.target.value)} >{review}</Textarea>
                    </FormControl>
                </ModalBody>

                <ModalFooter mx="auto">
                    <Button colorScheme="teal" onClick={submitReview}>
                        Submit Review
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SubmitReview
