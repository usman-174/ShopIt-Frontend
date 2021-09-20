import { Box, Heading } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/media-query';
import {
    FormControl, FormLabel, Button, useToast, Image, Input,
    NumberDecrementStepper, FormHelperText, NumberIncrementStepper, NumberInput, NumberInputField,
    NumberInputStepper, Select, Textarea, Center
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { MdCreateNewFolder } from 'react-icons/md';
import { useHistory } from 'react-router';
import { MoonLoader } from 'react-spinners';
import SideBar from '../../components/admin/SideBar';
import useProductById from '../../hooks/useGetProductById';

const UpdateProduct = ({ match }) => {
    const history = useHistory()
    const { success, product, isValidating } = useProductById(`/products/${match.params.id}`)

    const [isLargerThan768px] = useMediaQuery("(min-width: 768px)");
    const categories = [
        "electronics",
        "food",
        "camera",
        "laptops",
        "mobiles",
        "headphones",
        "accessories",
        "sports",
        "outdoor",
    ]
    const format = (val: string) => `$` + val
    const parse = (val: string) => val.replace(/^\$/, "")

    const toast = useToast()
    const Imageref = useRef<any>()
    const [price, setPrice] = React.useState(product?.price || "2.00")
    const [stock, setStock] = React.useState(product?.stock || "5")
    const [name, setName] = React.useState(product?.name || "")
    const [category, setCategory] = React.useState(product?.category || "")
    const [description, setDescription] = React.useState(product?.description || "")
    const [images, setImages] = React.useState<any>()
    const [imagesPreview, setImagesPreview] = React.useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files as FileList)
        setImagesPreview([])
        setImages([])
        if (files.length > 4) {
            toast({
                title: "Limit Reached",
                description: `Cannot upload more than 4 images.`,
                status: "error",
                duration: 1700,
                isClosable: true,
                position: 'top-right'
            })
            removeImages()
            return
        }
        files.forEach(file => {
            const fileSize = file.size / (1024 * 1024)
            var size = parseFloat(String(fileSize)).toFixed(2);

            if (parseInt(size) > 2) {

                toast({
                    title: "File Error",
                    description: `Image size is too large.`,
                    status: "error",
                    duration: 1700,
                    isClosable: true,
                    position: 'top-right'
                })
                removeImages()
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(prevState => [...prevState, reader.result])
                    setImages(prevState => [...prevState, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })

    }
    const removeImages = () => {
        Imageref.current.value = "";
        setImagesPreview([])
    }
    const submitProduct = async () => {
        let formData: any = {}

        if (name === product?.name && description === product?.description
            && category === product?.category && price === product.price && stock === product?.stock && !images?.length) {
            toast({
                title: "Details are same as Before",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        if (name !== product?.name) {
            formData.name = name
        }
        if (price !== product?.price) {
            formData.price = price
        }
        if (category !== product?.category) {
            formData.category = category
        } if (description !== product?.description) {
            formData.description = description
        } if (stock !== product?.stock) {
            formData.stock = stock
        } if (images?.length) {
            formData.images = images
        }

        try {
            setLoading(true)
            formData?.images?.length && toast({
                title: "Please wait a while",
                description: "Please wait while we upload images.",
                status: "info",
                duration: 1600,
                isClosable: true,
                position: 'top-right'
            })

            const { data } = await axios.put(`/products/admin/${match.params.id}`, formData)
            if (data.success) {
                toast({
                    title: "Sucess",
                    status: "success",
                    duration: 1300,
                    isClosable: true,
                    position: 'top-right'
                })
                history.goBack()
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
        if (success && product) {
            setPrice(product.price)
            setStock(product.stock)
            setName(product.name)
            setCategory(product.category)
            setDescription(product.description)
        }
    },
        [success, product])
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
                    }} />Update Product</Heading>
                    <Box p={8} mx="auto" maxWidth={isLargerThan768px ? "55%" : "70%"} borderWidth={1} borderRadius={8} boxShadow="lg">
                        <FormControl id="Name">
                            <FormLabel>Name</FormLabel>
                            <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name..." />
                        </FormControl>
                        <FormControl id="Stock">
                            <FormLabel>Stock</FormLabel>
                            <NumberInput
                                onChange={(valueString) => setStock(parse(valueString))}
                                value={stock}
                                max={99999}
                                min={5}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl id="Price">
                            <FormLabel>Price</FormLabel>
                            <NumberInput
                                onChange={(valueString) => setPrice(parse(valueString))}
                                value={format(price.toString())}
                                max={99999}
                                min={2}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl id="Caregory">
                            <FormLabel>Category</FormLabel>
                            <Select placeholder="Select option" onChange={(e) => setCategory(e.target.value)}>
                                {categories.map(categoryx =>
                                    <option selected={categoryx === category} key={categoryx} value={categoryx}>{categoryx}</option>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl id="description">
                            <FormLabel>Description</FormLabel>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} minLength={25} type="text" placeholder="Description..." />
                        </FormControl>
                        <FormControl id="Images">
                            <FormLabel>Choose Images</FormLabel>
                            <Input type="file" accept="images/*" ref={Imageref} multiple onChange={onFileChange} />
                            <FormHelperText textColor="tomato">Max Image size is 2MB.</FormHelperText>
                        </FormControl>
                        <FormControl id="ImagesPreview" p="2">
                            {
                                !imagesPreview.length && product?.images.map(img => <Image m="2"
                                    key={img.url} d="inline-flex" src={img.url}
                                    alt="Image Preview" borderRadius="md" w="100px" h="100px" />)
                            }
                            {imagesPreview.map(img =>
                            (<Image m="2" key={img} d="inline-flex" src={img}
                                alt="Image Preview" borderRadius="md" w="100px" h="100px" />
                            ))}
                            {imagesPreview.length ?
                                <Button mx="5" colorScheme="teal" size="sm" onClick={removeImages}>Reset Images</Button> : null}
                        </FormControl>
                        <FormControl mx="auto" textAlign="center">
                            <Button isLoading={loading} onClick={submitProduct}
                                colorScheme="teal">Update</Button>
                        </FormControl>

                    </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default UpdateProduct
