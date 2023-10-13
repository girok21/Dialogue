import { Avatar, Button, Divider, Flex, Select, Text, Textarea } from "@chakra-ui/react"
import PostOptions from "../components/PostOptions"
import UserFeed from "../components/UserFeed"

const HomePage = () => {
  return (
    <>
        <Flex w={"full"}
            position={"sticky"}
        >
            <Flex flex={2} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                <Text fontWeight={"bold"}>For You</Text>
            </Flex>
            <Flex flex={2} borderBottom={"1px solid gray"} justifyContent={"center"} pb="3" color={"gray.light"} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Following</Text>
            </Flex>
        </Flex>
        <Flex
            gap={5}
            py={3}
        >
            <Flex>
                <Avatar 
                    name="Bot Josh"
                    src="/CT-side.jpg"
                    size={{
                        base: 'sm',
                        md: 'md',
                    }}
                />
            </Flex>
            <Flex 
                flexDirection={"column"}
                gap={2}
                w={"full"}
            >
                <Select
                    h={5}
                    w={"fit-content"}
                    variant={"unstyled"}
                    fontSize={"xs"}
                >
                    <option value={"Everyone"}>Everyone</option>
                    <option value={"Network"}>Your Network</option>
                </Select>
                {/* <Input 
                    placeholder="Type your Dialogue!"
                    variant={"unstyled"}
                    w={"full"}
                    wordBreak={true}
                /> */}
                 <Textarea 
                    minH={10}
                    maxH={40}
                    placeholder="Share your Dialogue!"
                    variant={"unstyled"}
                 />
                 <Divider/>
                <Flex 
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <PostOptions />
                    <Button
                        borderRadius={"full"}
                        px={5}
                    >
                        Post
                    </Button>
                </Flex>
            </Flex>
    </Flex>
    <Divider />
    <UserFeed />
    </>
  )
}

export default HomePage