import { Avatar, Box, Flex, Text, VStack } from "@chakra-ui/react"
import { BsInstagram, BsTwitter } from "react-icons/bs"
const UserHeader = () => {
  return (
    <VStack spacing={4} alignItems={'start'}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>Bot Josh</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>botjosh</Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={0.5} borderRadius={"full"}>/dialogue-id</Text>
                </Flex>
            </Box>
            <Box>
                <Avatar 
                    name="Bot Josh"
                    src="/CT-side.jpg"
                    size={{
                        base: 'lg',
                        md: 'xl',
                    }}
                />
            </Box>
        </Flex>
        <Text fontSize={"sm"}>Counter-Terrorist, IGL and primary AWPer for CT-Side.</Text>
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>3.2k followers</Text>
                <Box w='0.5' h='6' bg={"gray.light"} borderRadius={"full"}></Box>
                <Text color={"gray.light"}>100 following</Text>
            </Flex>
            <Flex>
                <Box className="icon-container">
                    <BsInstagram size={24} cursor={"pointer"} />
                </Box>
                <Box className="icon-container">
                    <BsTwitter size={24} cursor={"pointer"}/>
                </Box>
            </Flex>
        </Flex>
        <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                <Text fontWeight={"bold"}>Dialogues</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} pb="3" color={"gray.light"} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader