import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react"
import Comment from "../components/Comment"
import { CgClose } from "react-icons/cg"


const PostPage = () => {
  const [liked, setLiked] = useState(false);
  const [isImgFullScreen, setImgFullScreen] = useState(false);
  //to lock the scroll when opened image in full screen mode
  if(isImgFullScreen){
      document.body.style.overflow = 'hidden';
  }else{
      document.body.style.overflow = 'scroll';
  }
  const toggleFullScreen = () => {
      setImgFullScreen(!isImgFullScreen);
    };
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={"center"} gap={3}>
          <Avatar src="/CT-side.jpg" size={"md"} name="Bot Josh" zIndex={-1}/>
          <Flex alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>botjosh</Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>Just picked up this sick AWP.</Text>
      <Box borderRadius={6}
                    overflow={"hidden"}
                    border={"1px solid"}
                    borderColor={"gray.light"}>
                        <Image src="/a96dd-16964938314592-1920.avif" w={"full"} 
                        onClick={(e)=>{toggleFullScreen(); console.log(isImgFullScreen);e.preventDefault();}}
                        cursor={"pointer"}/>
      </Box>
      {isImgFullScreen && <Box w={"full"} h={"full"}
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
                                <Image src={"/a96dd-16964938314592-1920.avif"}                                   
                                    maxW={"100vw"}
                                    maxH={"100vh"}
                                    h={"auto"}
                                    cursor={"default"}
                                    onClick={e => {e.preventDefault();e.stopPropagation()}}
                                />
                            </Box>}
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"}>{480 + (liked? 1: 0)} likes</Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={"gray.light"}></Box>
        <Text color={"gray.light"}>238 replies</Text>
      </Flex>
      <Divider my={3}></Divider>
      <Comment 
        comment = "Looks really sick"
        createdAt = "2d"
        likes = {100}
        userName = "John Doe"
        userAvatar = "https://bit.ly/dan-abramov"
      />
      <Comment 
        comment = "Where you get that?"
        createdAt = "1d"
        likes = {50}
        userName = "James Sane"
        userAvatar = "https://bit.ly/kent-c-dodds"
      />
      <Comment 
        comment = "Lucky guy!"
        createdAt = "1d"
        likes = {100}
        userName = "Bot James"
        userAvatar = "https://bit.ly/code-beast"
      />
    </>
  )
}

export default PostPage