import { Avatar, Button, CloseButton, Divider, Flex, Image, Input, Select, Text, Textarea, useToast } from "@chakra-ui/react"
import PostOptions from "../components/PostOptions"
import UserFeed from "../components/UserFeed"
import { useEffect, useState, useRef } from "react";
import { useCreatePostMutation } from "../slices/postApiSlice";
import { useGetUserFeedQuery } from "../slices/userApiSlice";
import { useNavigate } from "react-router-dom";
import  usePreviewImg  from '../hooks/usePreviewImage.js'
import { BiPoll, BiSolidImageAdd } from "react-icons/bi";
import { PiGifFill } from "react-icons/pi";
import { RiEmojiStickerFill } from "react-icons/ri";
import { MdScheduleSend } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../slices/authSlice.js'
const HomePage = () => {

    // const [userInfo] = useSelector((auth)=>auth.state)
    const { userInfo } = useSelector((state)=> state.auth) 
    const [postText, setPostText] = useState("");
    const [createPost] = useCreatePostMutation();
    const { data, isLoading, error, refetch } = useGetUserFeedQuery();
    const imageRef = useRef(null)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

    //want to refetch if someone from my network posts a new dialogue
    useEffect(()=>{
        refetch();
    }, [])
    const toast = useToast();
    const ref = useRef(null);

    const submitHandler = async(e)=>{
        e.preventDefault();
        try {
            // await createPost({
            //     text: postText,
            //     image: imgUrl,
            // });
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
            // toast({
            //     title: "Post Created Successfully!",
            //     status: 'success',
            //     duration: 1000,
            //     isClosable: false,
            //   })
        } catch (error) {
            toast({
                title: error.data,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

  return (
    <>
        <Flex
            gap={5}
            py={3}
        >
            <Flex>
                <div 
                        onClick={(e)=>{e.preventDefault(); navigate(`/user/${userInfo?.username}`)}}
                        style={{cursor: "pointer"}}
                        >
                    <Avatar 
                        name={userInfo?.firstName + userInfo?.lastName}
                        src={userInfo?.profilePicture || '/default-profile.jpg'}
                        size={{
                            base: 'sm',
                            md: 'md',
                        }}
                        zIndex={-1}
                    />
                </div>
            </Flex>
            <form
                    onSubmit={submitHandler}
                    style={{width:'100%'}}
                >
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
                    <Flex 
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Flex gap={4} cursor={"pointer"}>
                            <BiSolidImageAdd size={20} onClick = {()=> imageRef.current.click()}/>
                            <PiGifFill size={20}/>
                            <RiEmojiStickerFill size={20}/>
                            <BiPoll size={20} />
                            <MdScheduleSend size={20}/>
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
            </Flex>
        </form>
    </Flex>
    <Divider />
    {isLoading && !data? (
        <h2>Loading...</h2>
      ):error ? ( error.data.includes("token")? 
                    (
                        dispatch(logout())//if the error has to do anything with the token, just logout and refresh the token
                    ) : 
                    (<Text color="red.500">{error.data}</Text>) ) : (
    <UserFeed feedPosts = {data.feedPosts}/>)}
    </>
  )
}

export default HomePage