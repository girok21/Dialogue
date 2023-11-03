import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import { CgClose } from "react-icons/cg"
import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions"
import { useEffect, useRef, useState } from "react";
import { useGetPostCommentQuery, useDeletePostMutation } from "../slices/postApiSlice";
import { useGetUserByIdQuery } from '../slices/userApiSlice.js'
import useCustomToast from "../hooks/useCustomToast";
import { useSelector } from "react-redux"

const Post = ({post, isShare, author_username, author_name}) => {

    const userId=post.user;
    const postId=post._id;
    const images=post.images || [];
    const postTitle=post.text;

    const postImg = images?.length > 0;
    const [isImgFullScreen, setImgFullScreen] = useState(false);
    const [user, setUser] = useState(null);
    const [ isReplied, setIsReplied ] = useState(false);
    const [commentId, setCommentId] = useState(null);//this is current user's comment id to the post
    const [ replyObject, setReplyObject ] = useState(null);

    const { userInfo } = useSelector((state)=>state.auth);

    const {data, isLoading, error} = useGetUserByIdQuery(userId || "");
    const { data: comment, isLoading: isCommentLoading, error: commentError} = useGetPostCommentQuery(commentId, {
        skip: commentId? false: true
    });//used skip hook to avoid unnecessary fetch call when commentId is null

    const [deletePost] = useDeletePostMutation();

    const { showToast } = useCustomToast();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
  
    const navigate = useNavigate();

    useEffect(()=>{
        if(data){
            setUser(data);
        }
    }, [data])

    useEffect(()=>{
        if(post && userInfo){
        {
            post.comments.forEach(({_id, userId}) => {
                if(userInfo._id === userId)
                {
                    setIsReplied(true);
                    setCommentId(_id);
                    return;
                }
            });
        }
        }
    }, [post, userId, userInfo]);

    useEffect(()=>{
        if(!error && comment){
            setReplyObject(comment);
        }
    }, [comment])//setup the comment object

    //to lock the scroll when opened image in full screen mode
    if(isImgFullScreen){
        document.body.style.overflow = 'hidden';
    }else{
        document.body.style.overflow = 'scroll';
    }
    const toggleFullScreen = () => {
        setImgFullScreen(!isImgFullScreen);
      };

    const deleteClickHandler = async () => {
        try {
            const res = await deletePost(postId);
            if (res && res.error) {
                showToast(res.error.data.message, 'error');
            } else if (res && res.data) {
                showToast(res.data.message, 'info');
            } else {
                throw new Error(res?.error?.data?.message || "Internal Server Error");
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
        onClose();
    }

    //to ensure post content doesn't get rendred before user data
    if(isLoading){
        return <></>
    }

  return (
    <>
        {isShare && <Link to={`/user/${author_username}`} >
            <Flex pt={5} flexDirection={'row'} ml={{base:'5',md:'10'}} alignItems={'center'} color={'#62676b'}>
                {repostSvg()}
                <Text className="text-underline" width={'fit-content'} fontWeight={'semibold'} fontSize={{base:'xs', md:'sm'}} >
                    {author_name} reposted
                </Text>
            </Flex>
        </Link>}
        <Link to={"/user/botjosh/post/1"}>
            <Flex flexDirection={'column'} gap={0} >
                <Flex gap={4} mb={0} >
                    <Flex flexDirection={"column"} alignItems={"center"}>
                        <div 
                            onClick={(e)=>{e.preventDefault(); navigate(`/user/${user?.username}`)}}
                            style={{cursor: "pointer"}}
                            >             
                            <Avatar 
                                key={user?._id}
                                name={user?.firstName}
                                src={user?.profilePicture || "/default-profile.jpg"}
                                size={{
                                    base: 'sm',
                                    md: 'md',
                                }}
                                zIndex={-1}
                            />
                        </div>
                        {isReplied && <Box w="1px" h={"full"} bg="gray.light" my={1}></Box>}
                        {/* <Box position={"relative"} w={"full"}>
                            <Avatar 
                                size="xs"
                                name="John Doe"
                                src="https://bit.ly/dan-abramov"
                                position={"absolute"}
                                top={"0px"}
                                left={"15px"}
                                padding={"2px"}
                                zIndex={-1}
                            />
                            <Avatar 
                                size="xs"
                                name="John Doe"
                                src="https://bit.ly/dan-abramov"
                                position={"absolute"}
                                bottom={"0px"}
                                right={"-5px"}
                                padding={"2px"}
                                zIndex={-1}
                            />
                            <Avatar 
                                size="xs"
                                name="John Doe"
                                src="https://bit.ly/dan-abramov"
                                position={"absolute"}
                                bottom={"0px"}
                                left={"4px"}
                                padding={"2px"}
                                zIndex={-1}
                            />
                        </Box> */}
                    </Flex>
                    <Flex flex={1} flexDirection={"column"} gap={0}>
                        <Flex justifyContent={"space-between"}  w={"full"}>
                            <Flex w={"full"} alignItems={"center"}>
                                <Text className="text-underline" fontSize={{sm:"sm", md:'md'}} fontWeight={"bold"}>{user?.firstName+' '+user?.lastName}</Text>
                                <Image src="/verified.png" w={4} h={4} ml={1} />
                            </Flex>
                            <Flex gap={4} alignItems={"center"} h={'fit-content'}>
                                <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                                <Flex onClick={(e) => { e.preventDefault(); }}>
                                    <Menu isLazy>
                                        <MenuButton className="icon-container">
                                            <Box className="icon-container">
                                                <BsThreeDots/>                    
                                            </Box>
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={onOpen}>
                                                Delete Post
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                    <AlertDialog
                                        isOpen={isOpen}
                                        leastDestructiveRef={cancelRef}
                                        onClose={onClose}
                                    >
                                        <AlertDialogOverlay>
                                        <AlertDialogContent>
                                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                            Delete Post
                                            </AlertDialogHeader>

                                            <AlertDialogBody>
                                            Are you sure? You can't undo this action afterwards.
                                            </AlertDialogBody>

                                            <AlertDialogFooter>
                                            <Button ref={cancelRef} onClick={onClose}>
                                                Cancel
                                            </Button>
                                            <Button colorScheme='red' onClick={deleteClickHandler} ml={3}>
                                                Delete
                                            </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialogOverlay>
                                    </AlertDialog>

                                </Flex>
                            </Flex>
                        </Flex>
                        <Text fontSize={"sm"}>{postTitle}</Text>
                        {postImg && <Box borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}
                            >
                                <Image src={images[0]} w={"full"}  
                                    onClick={(e)=>{toggleFullScreen(); e.preventDefault();}}
                                    cursor={"pointer"}/>
                        </Box>}
                        {isImgFullScreen && postImg && 
                                            <Box w={"full"} h={"full"}
                                                            position={"fixed"} 
                                                            top={0} 
                                                            left={0}
                                                            bgColor={"rgba(0, 0, 0, 0.9)"}
                                                            display={"flex"}
                                                            justifyContent={"center"}
                                                            alignItems={"center"}
                                                            cursor={"default"}
                                                            onClick={(e)=>{setImgFullScreen(toggleFullScreen);e.preventDefault();}}>
                                            <Box className="icon-container"
                                                display={"flex"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                                position={"fixed"}
                                                top={10}
                                                left={10}
                                                cursor={"pointer"}
                                                onClick={(e)=>{setImgFullScreen(toggleFullScreen);e.preventDefault();}}
                                            >
                                                <CgClose />
                                            </Box>
                                        <Image src={images[0]}                                   
                                            maxW={"100vw"}
                                            maxH={"100vh"}
                                            h={"auto"}
                                            cursor={"default"}
                                            onClick={e => {e.preventDefault();e.stopPropagation()}}
                                            zIndex={10}
                                        />
                                    </Box>}
                        <Actions post={post} authorName={user?.firstName}/>
                    </Flex>
                </Flex>
                <Flex w={'full'} mb={4}>
                    {isReplied && replyObject && 
                        <>
                            <Flex gap={3}>
                                <Avatar 
                                    key={userInfo?._id}
                                    name={userInfo?.firstName}
                                    src={userInfo?.profilePicture || "/default-profile.jpg"}
                                    size={{
                                        base: 'sm',
                                        md: 'md',
                                    }}
                                    zIndex={-1}
                                />
                                <Flex flexDirection={'column'}>
                                    <Text fontSize={{base:'xs', md:'sm'}} fontWeight={'semibold'}>@{userInfo?.username}</Text>
                                    <Text fontSize={{base:'xs', md:'sm'}} >{replyObject?.text || ""}</Text>
                                </Flex>
                            </Flex>
                        </>
                    }
                </Flex>
            </Flex>
        </Link>
    </>
  )
}

export default Post;

const repostSvg = ()=> (
        <svg height={16} color="currentColor" fill="#62676b" role="img" viewBox="0 0 24 24" width="20"><g><path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g></svg>
)