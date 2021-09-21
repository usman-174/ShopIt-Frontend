import { Box, Heading } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/media-query';
import {
    FormControl, FormLabel, Button, useToast, Image, Input,
    NumberDecrementStepper, FormHelperText, NumberIncrementStepper, NumberInput, NumberInputField,
    NumberInputStepper, Select, Textarea
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { MdCreateNewFolder } from 'react-icons/md';
import SideBar from '../../components/admin/SideBar';

const CreateProduct = () => {
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
    const parse = (val) => val.replace(/^\$/, "")

    const toast = useToast()
    const Imageref = useRef<any>()
    const [price, setPrice] = React.useState("2.00")
    const [stock, setStock] = React.useState("5")
    const [name, setName] = React.useState("")
    const [category, setCategory] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [images, setImages] = React.useState<any[]>([])
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
        if (!name) {
            toast({
                title: "Invalid Name",
                status: "error",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            return
        } else if (!description || description.length < 25) {
            toast({
                title: "Description length must be greater than 25.",
                status: "error",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        else if (!category) {
            toast({
                title: "Invalid Category.",
                status: "error",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        try {
            setLoading(true)
            toast({
                title: "Please wait a while",
                description: "Please wait while we upload the Images",
                status: "info",
                duration: 1500,
                isClosable: true,
                position: 'top-right'
            })
            const formData = {
                name, price, stock, description, category, images
            }
            console.log("formdata=", formData);

            const { data } = await axios.post("/products/admin/new", formData)
            if (data.success) {
                toast({
                    title: "Sucess",
                    status: "success",
                    duration: 1300,
                    isClosable: true,
                    position: 'top-right'
                })
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
                    }} />Create Product</Heading>
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
                                value={format(price)}
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
                                    <option key={categoryx} value={categoryx}>{categoryx}</option>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl id="description">
                            <FormLabel>Description</FormLabel>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)}
                                minLength={25} type="text" placeholder="Description..." />
                        </FormControl>
                        <FormControl id="Images">
                            <FormLabel>Choose Images</FormLabel>
                            <Input type="file" ref={Imageref} multiple onChange={onFileChange} />
                            <FormHelperText textColor="tomato">Max Image size is 2MB.</FormHelperText>
                        </FormControl>
                        <FormControl id="ImagesPreview" p="2">
                            {imagesPreview.map(img =>
                            (<Image m="2" key={img} d="inline-flex" src={img}
                                alt="Image Preview" borderRadius="md" w="100px" h="100px" />

                            ))}
                            {imagesPreview.length ?
                                <Button mx="5" colorScheme="teal" size="sm" onClick={removeImages}>Reset Images</Button> : null}
                        </FormControl>
                        <FormControl mx="auto" textAlign="center">
                            <Button isLoading={loading} onClick={submitProduct} colorScheme="teal">Create</Button>
                        </FormControl>

                    </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default CreateProduct
