import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react"
import Comment from "../components/Comment"


const PostPage = () => {
  const [liked, setLiked] = useState(false)
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={"center"} gap={3}>
          <Avatar src="/CT-side.jpg" size={"md"} name="Bot Josh"/>
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
                        <Image src="/a96dd-16964938314592-1920.avif" w={"full"} />
      </Box>
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