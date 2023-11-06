import { Button, CloseButton, Divider, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { BiSolidImageAdd } from "react-icons/bi"
import usePreviewImage from "../hooks/usePreviewImage";
import { useRef, useState } from "react";
import { useCreatePostMutation } from "../slices/postApiSlice";
import { useGetUserFeedQuery } from "../slices/userApiSlice";
import EmojiPickerIcon from "./EmojiPickerIcon";

const CreatePostModal = ({ isOpen, onOpen, onClose }) => {

    const ref = useRef(null);
    const toast = useToast();
    const [postText, setPostText] = useState("");
    const imageRef = useRef(null);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
    const [createPost] = useCreatePostMutation();
    const { refetch } = useGetUserFeedQuery();

    const handleEmojiSelect = (e)=>{
        let text = postText;
        text = text + e.native;
        setPostText(text)
    }

    const submitHandler = async(e)=>{
        e.preventDefault();
        if(postText === "" && imgUrl === ""){
            return showToast("Your Dialogue's Empty!")
        }
        try {
            const postPromise = new Promise(async (resolve, reject) => {
                try {
                  const response = await createPost({
                    text: postText,
                    image: imgUrl,
                  });
                  refetch();
                  resolve(response.data);
                } catch (error) {
                  reject(error);
                }
              });
              toast.promise(postPromise, {
                  success: { title: 'Dialogue Posted', description: 'Looks great' },
                  error: { title: 'Internal Server Error!', description: 'Something wrong' },
                  loading: { title: 'Posting your Dialogue', description: 'Please wait' },
                })
            setImgUrl("");
            setPostText("");
            ref.current.value = "";
        } catch (error) {
            toast({
                title: error.data,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        onClose();
    }

    return (
        <>
            <Flex 
                flexDirection={'column'}
                gap={2}
            >
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent minW={{base:'95%', sm:'80%', md:'60%', lg: '50%', xl: '45%'}}>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <form
                        onSubmit={submitHandler}
                        style={{width:'100%'}}
                    >

                    <ModalBody>
                        <Flex 
                            flexDirection={"column"}
                            gap={2}
                            w={"100%"}
                        >
                            <Textarea
                                ref = {ref}
                                w={'full'}
                                minH={15}
                                maxH={40}
                                placeholder="Share your Dialogue!"
                                variant={"unstyled"}
                                onChange={(e)=>{setPostText(e.target.value)}}
                                value={postText}
                            />
                            {imgUrl && 
                                <Flex mt={5} w={'40%'} position={'relative'}>
                                    <Image src={imgUrl} alt={'Selected Image'} />
                                    <CloseButton
                                        onClick={()=>{setImgUrl('')}}
                                        bg={'gray.800'}
                                        position={'absolute'}
                                        top={2}
                                        right={2}
                                    />
                                </Flex>
                            }
                            <Input 
                                type="file"
                                hidden
                                ref={imageRef}
                                onChange={handleImageChange}
                            />
                            <Divider/>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Flex 
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            w={'100%'}
                            pl={'2%'}
                            pr={'2%'}
                        >
                            <Flex gap={4} cursor={"pointer"}>
                                <BiSolidImageAdd size={20} onClick = {()=> imageRef.current.click()}/>
                                <EmojiPickerIcon handleEmojiSelect={handleEmojiSelect}/>
                            </Flex>                        
                            <Button
                                type="submit"
                                borderRadius={"full"}
                                px={5}
                                colorScheme="gray"
                            >
                                Post
                            </Button>
                        </Flex>
                    </ModalFooter>
                    </form>
                    </ModalContent>
                </Modal>
            </Flex>
        </>
    )
}

export default CreatePostModal